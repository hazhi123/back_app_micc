import * as moment from 'moment';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { codigoLincencia } from '../../utils/create-licenses-free';
import { GaleriaService } from '../galeria/galeria.service';
import { LicenciasService } from '../licencias/licencias.service';
import {
  AsignarCComercialesDto,
  CreateImageDto,
  createUsuariosDto,
  GetAllDto,
  updatedUsuariosDto,
  UpdateImageDto,
} from './dto';
import {
  UsuariosCComercialesEntity,
} from './entities/usuarios-ccomerciales.entity';
import {
  UsuariosInformacionEntity,
} from './entities/usuarios-informacion.entity';
import { UsuariosEntity } from './entities/usuarios.entity';

@Injectable()
export class UsuariosService {

  constructor(
    private galeriaService: GaleriaService,
    private licenciasService: LicenciasService,

    @InjectRepository(UsuariosEntity)
    private readonly usuariosRP: Repository<UsuariosEntity>,

    @InjectRepository(UsuariosInformacionEntity)
    private readonly informacionRP: Repository<UsuariosInformacionEntity>,

    @InjectRepository(UsuariosCComercialesEntity)
    private readonly usuariosCComercialesRP: Repository<UsuariosCComercialesEntity>,

  ) { }

  async create(dto: createUsuariosDto, userLogin: UsuariosEntity) {
    // Valida el usuario si existe
    const userExist = await this.findUsuario(dto.usuario);
    if (!isEmptyUndefined(userExist)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Este usuario ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)

    const create = await this.usuariosRP.create({
      ...dto,
      tiendaCC: dto.tienda,
      cineCC: dto.cine,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    const save = await this.usuariosRP.save(create);

    const {
      dni, direccion, celular, telefono
    } = dto

    await this.informacionRP.save({
      dni,
      celular,
      direccion,
      correo: dto.usuario,
      telefono,
      usuario: save.id
    });

    const dataLicencia = {
      licencia: await codigoLincencia(),
      fechaInicio: moment().format('YYYY-MM-DD').toString(),
      fechaFinal: moment().add(20, 'days').format('YYYY-MM-DD').toString(),
      usuario: save.id,
      ccomercial: null,
      tienda: null,
      status: true
    }
    await this.licenciasService.create(dataLicencia, userLogin)
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<UsuariosEntity>> {
    const query = await this.usuariosRP
      .createQueryBuilder("usu")
    query.leftJoinAndSelect("usu.perfil", "per")
      .leftJoinAndSelect("usu.image", "usuGal")
      .leftJoinAndSelect("usu.imageBack", "usuGalBack")
      .leftJoinAndSelect("usu.ciudad", "ciu")
      .leftJoinAndSelect("ciu.estado", "edo")
      .leftJoinAndSelect("edo.pais", "pais")
      .leftJoinAndSelect("usu.informacion", "inf")
      .leftJoinAndSelect("usu.ccomercial", "cc")
      .leftJoinAndSelect("usu.tiendaCC", "tieCC")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("usu.cineCC", "cinCC")
      .leftJoinAndSelect("cinCC.cine", "cine")
      .select([
        'usu.id',
        'usu.nombre',
        'usu.apellido',
        'usu.usuario',
        'usu.isTrabajador',
        'usu.status',
        'usuGal.id',
        'usuGal.file',
        'usuGalBack.id',
        'usuGalBack.file',
        'per.id',
        'per.nombre',
        'cc.id',
        'cc.nombre',
        'tieCC.id',
        'tie.id',
        'tie.nombre',
        'cinCC.id',
        'cine.id',
        'cine.nombre',
        'ciu.id',
        'ciu.ciudad',
        'edo.id',
        'edo.estado',
        'pais.id',
        'pais.nombre',
        'inf.usuario',
        'inf.celular',
        'inf.dni',
      ])
    if (!isEmptyUndefined(dto.perfil)) {
      query.andWhere('usu.perfil = :perfil', { perfil: dto.perfil })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('usu.ccomercial = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      query.andWhere('usu.tiendaCC = :tienda', { tienda: dto.tienda == 0 ? null : dto.tienda })
    }
    if (!isEmptyUndefined(dto.cine)) {
      query.andWhere('usu.cineCC = :cine', { cine: dto.cine == 0 ? null : dto.cine })
    }
    if (!isEmptyUndefined(dto.isVisitante)) {
      query.andWhere('usu.isVisitante = :isVisitante', { isVisitante: dto.isVisitante })
    }
    if (!isEmptyUndefined(dto.isTrabajador)) {
      query.andWhere('usu.isTrabajador = :isTrabajador', { isTrabajador: dto.isTrabajador })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('usu.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.ciudad)) {
      query.andWhere('usu.ciudad = :ciudad', { ciudad: dto.ciudad })
    }
    query.addOrderBy("usu.nombre", "ASC")
    query.getMany();
    return paginate<UsuariosEntity>(query, options);
  }

  async getOne(id: number) {
    const getOne = await this.usuariosRP
      .createQueryBuilder("usu")
      .leftJoinAndSelect("usu.perfil", "per")
      .leftJoinAndSelect("usu.image", "imgGal")
      .leftJoinAndSelect("usu.imageBack", "imgBackGal")
      .leftJoinAndSelect("usu.ciudad", "ciu")
      .leftJoinAndSelect("ciu.estado", "edo")
      .leftJoinAndSelect("edo.pais", "pais")
      .leftJoinAndSelect("usu.informacion", "inf")
      .leftJoinAndSelect("usu.ccomercial", "cc")
      .leftJoinAndSelect("usu.tiendaCC", "tieCC")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("usu.cineCC", "cinCC")
      .leftJoinAndSelect("cinCC.cine", "cine")
      .leftJoinAndSelect("usu.licencia", "lic")
      .leftJoinAndSelect("lic.plan", "plan")
      .select([
        'usu.id',
        'usu.nombre',
        'usu.apellido',
        'usu.usuario',
        'usu.createdBy',
        'usu.createdAt',
        'usu.updatedBy',
        'usu.updatedAt',
        'usu.status',
        'usu.isTrabajador',
        'usu.isVisitante',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'per.id',
        'per.nombre',
        'cc.id',
        'cc.nombre',
        'tieCC.id',
        'tie.id',
        'tie.nombre',
        'cinCC.id',
        'cine.id',
        'cine.nombre',
        'ciu.id',
        'ciu.ciudad',
        'edo.id',
        'edo.estado',
        'pais.id',
        'pais.nombre',
        'inf.usuario',
        'inf.dni',
        'inf.celular',
        'inf.direccion',
        'inf.telefono',
        'lic.id',
        'lic.licencia',
        'lic.fechaInicio',
        'lic.fechaFinal',
        'lic.isPrueba',
        'lic.isCancelado',
        'plan.id',
        'plan.nombre',
        'plan.desc',
        'plan.costo',
      ])
      .where('usu.id = :id', { id })
      .getOne()

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: updatedUsuariosDto, userLogin: UsuariosEntity) {
    const getOne = await this.getOne(dto.id)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    let {
      id,
      nombre,
      apellido,
      usuario,
      parroquia,
      contrasena,
      perfil,
      status,
      ccomercial,
      tienda,
      cine,
      isVisitante,
      isTrabajador,
      dni,
      celular,
      direccion,
      telefono,
    } = dto

    const dataInformacion = {
      dni,
      celular,
      direccion,
      correo: usuario,
      telefono,
      parroquia,
      usuario: id,
    }
    if (isEmptyUndefined(getOne.informacion)) {
      await this.informacionRP.save(dataInformacion);
    } else {
      const assinginformacion = Object.assign(getOne.informacion, dataInformacion)
      await this.informacionRP.update(getOne.id, assinginformacion);
    }

    if (isVisitante) {
      getOne['ccomercial'] = null;
      getOne['tiendaCC'] = null;
      getOne['cineCC'] = null;
      ccomercial = null;
      tienda = null;
      cine = null;
    }

    const objectUsuarios = Object.assign(getOne, {
      nombre,
      apellido,
      usuario,
      contrasena,
      isVisitante,
      isTrabajador,
      perfil,
      ccomercial,
      tiendaCC: tienda,
      cineCC: cine,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status,
    })
    if (isEmptyUndefined(dto.contrasena)) {
      delete objectUsuarios.contrasena
    }

    delete getOne.informacion
    delete getOne.ccomerciales
    delete getOne.licencia

    await this.usuariosRP.update(getOne.id, objectUsuarios);

    const res = await this.getOne(dto.id);
    return res;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    await this.usuariosRP.update(id, { status: false });
    return await this.getOne(id);
  }

  async findUsuario(usuario: string) {
    return await this.usuariosRP
      .createQueryBuilder('usu')
      .where({ usuario })
      .addSelect('usu.contrasena')
      .getOne()
  }

  async findCelular(celular: string) {
    const findOne = await this.informacionRP.findOne({
      where: { celular }
    })
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.USER.WARNING.MOBILE_CREATE,
    }, HttpStatus.ACCEPTED)
  }

  async findDni(dni: string) {
    const findOne = await this.informacionRP.findOne({
      where: { dni }
    })
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'El dni ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsuariosEntity) {
    try {
      const data = {
        entidad: 'usuario',
        entId: parseInt(dto.usuario),
        referencia: parseInt(dto.isBack) == 0 ? 'image' : 'imageBack',
        refId: parseInt(dto.usuario),
      }
      const res = await this.galeriaService.create(file, data, userLogin)
      if (parseInt(dto.isBack) == 0) {
        await this.usuariosRP.update(parseInt(dto.usuario), {
          image: res.id
        });
      } else {
        await this.usuariosRP.update(parseInt(dto.usuario), {
          imageBack: res.id
        });
      }
      return res;
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: 'Error al registrar la imagen',
      }, HttpStatus.ACCEPTED)
    }
  }

  async updateImage(dto: UpdateImageDto) {
    await this.usuariosRP.update(dto.usuario,
      dto.isBack ? { imageBack: dto.galeria } : { image: dto.galeria }
    );
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async asignarCComerciales(dto: AsignarCComercialesDto) {
    for (let i = 0; i < dto.ccomerciales.length; i++) {
      const data = {
        usuario: dto.usuario,
        ccomercial: dto.ccomerciales[i]
      };
      const findOne = await this.usuariosCComercialesRP.findOne({ where: data })
      if (isEmptyUndefined(findOne)) {
        await this.usuariosCComercialesRP.save(data);
      } else {
        await this.usuariosCComercialesRP.delete(findOne.id);
      }
    }
    return 1;
  }

  async getCComerciales(id: Number, options: IPaginationOptions): Promise<Pagination<UsuariosCComercialesEntity>> {
    const query = await this.usuariosCComercialesRP
      .createQueryBuilder("usuCC")
      .leftJoinAndSelect("usuCC.ccomercial", "cc")
      .leftJoinAndSelect("cc.image", "imgGal")
      .leftJoinAndSelect("cc.imageBack", "imgBackGal")
      .leftJoinAndSelect("cc.ciudad", "ciu")
      .select([
        'usuCC.id',
        'cc.id',
        'cc.nombre',
        'cc.direccion',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'ciu.id',
        'ciu.ciudad',
      ])
      .where('usuCC.usuario = :id', { id })
      .orderBy("cc.nombre", "ASC")
    query.getMany();
    return paginate<UsuariosCComercialesEntity>(query, options);
  }

}