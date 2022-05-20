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
  createUsersDto,
  GetAllDto,
  updatedUsersDto,
  UpdateImageDto,
} from './dto';
import { UsersCComercialesEntity } from './entities/users-ccomerciales.entity';
import { UsersInformacionEntity } from './entities/users-informacion.entity';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRP: Repository<UsersEntity>,

    @InjectRepository(UsersInformacionEntity)
    private readonly informacionRP: Repository<UsersInformacionEntity>,

    @InjectRepository(UsersCComercialesEntity)
    private readonly usersCComercialesRP: Repository<UsersCComercialesEntity>,

    private galeriaService: GaleriaService,
    private licenciasService: LicenciasService
  ) { }

  async create(dto: createUsersDto, userLogin: UsersEntity) {
    // Valida el usuario si existe
    const userExist = await this.findUser(dto.user);
    if (!isEmptyUndefined(userExist)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Este usuario ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)

    const create = await this.usersRP.create({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    const save = await this.usersRP.save(create);

    const {
      dni, direccion, celular, telefono
    } = dto

    await this.informacionRP.save({
      dni,
      celular,
      direccion,
      correo: dto.user,
      telefono,
      user: save.id
    });

    const dataLicencia = {
      licencia: await codigoLincencia(),
      fechaInicio: moment().format('YYYY-MM-DD').toString(),
      fechaFinal: moment().add(20, 'days').format('YYYY-MM-DD').toString(),
      user: save.id,
      ccomercial: null,
      tienda: null,
      status: true
    }
    await this.licenciasService.create(dataLicencia, userLogin)
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<UsersEntity>> {
    const query = await this.usersRP
      .createQueryBuilder("user")
    query.leftJoinAndSelect("user.perfil", "per")
      .leftJoinAndSelect("user.image", "userGal")
      .leftJoinAndSelect("user.imageBack", "userGalBack")
      .leftJoinAndSelect("user.ciudad", "ciu")
      .leftJoinAndSelect("ciu.estado", "edo")
      // .leftJoinAndSelect("edo.pais", "pais")
      .leftJoinAndSelect("user.informacion", "inf")
      .leftJoinAndSelect("user.ccomercial", "cc")
      .leftJoinAndSelect("user.tienda", "tie")
      .select([
        'user.id',
        'user.nombre',
        'user.apellido',
        'user.user',
        'user.isTrabajaTienda',
        'user.status',
        'userGal.id',
        'userGal.file',
        'userGalBack.id',
        'userGalBack.file',
        'per.id',
        'per.nombre',
        'cc.id',
        'cc.nombre',
        'tie.id',
        'tie.nombre',
        'ciu.id',
        'ciu.ciudad',
        'edo.id',
        'edo.estado',
        'inf.user',
        'inf.celular',
        'inf.dni',
      ])
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      query.andWhere('tie.id = :tienda', { tienda: dto.tienda == 0 ? null : dto.tienda })
    }
    if (!isEmptyUndefined(dto.isVisitante)) {
      query.andWhere('user.isVisitante = :isVisitante', { isVisitante: dto.isVisitante })
    }
    if (!isEmptyUndefined(dto.isTrabajaTienda)) {
      query.andWhere('user.isTrabajaTienda = :isTrabajaTienda', { isTrabajaTienda: dto.isTrabajaTienda })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('user.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.ciudad)) {
      query.andWhere('user.ciudad = :ciudad', { ciudad: dto.ciudad })
    }
    query.addOrderBy("user.nombre", "ASC")
    query.getMany();
    return paginate<UsersEntity>(query, options);
  }

  async getOne(id: number) {
    const getOne = await this.usersRP
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.perfil", "per")
      .leftJoinAndSelect("user.image", "imgGal")
      .leftJoinAndSelect("user.imageBack", "imgBackGal")
      .leftJoinAndSelect("user.ciudad", "ciu")
      .leftJoinAndSelect("ciu.estado", "edo")
      // .leftJoinAndSelect("edo.pais", "pais")
      .leftJoinAndSelect("user.informacion", "inf")
      .leftJoinAndSelect("user.ccomercial", "cc")
      .leftJoinAndSelect("user.tienda", "tie")
      .leftJoinAndSelect("user.licencia", "lic")
      .leftJoinAndSelect("lic.plan", "plan")
      .select([
        'user.id',
        'user.nombre',
        'user.apellido',
        'user.user',
        'user.createdBy',
        'user.createdAt',
        'user.updatedBy',
        'user.updatedAt',
        'user.status',
        'user.isTrabajaTienda',
        'user.isVisitante',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'per.id',
        'per.nombre',
        'tie.id',
        'tie.nombre',
        'cc.id',
        'cc.nombre',
        'ciu.id',
        'ciu.ciudad',
        'edo.id',
        'edo.estado',
        // 'pais.id',
        // 'pais.nombre',
        'inf.user',
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
      .where('user.id = :id', { id })
      .getOne()

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: updatedUsersDto, userLogin: UsersEntity) {
    const getOne = await this.getOne(dto.id)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    let {
      id, nombre, apellido, user, parroquia, password, perfil, status, celular, ccomercial, isVisitante, tienda, dni, isTrabajaTienda, direccion, telefono,
    } = dto

    const dataInformacion = {
      dni,
      celular,
      direccion,
      correo: user,
      telefono,
      parroquia,
      user: id,
    }
    if (isEmptyUndefined(getOne.informacion)) {
      await this.informacionRP.save(dataInformacion);
    } else {
      const assinginformacion = Object.assign(getOne.informacion, dataInformacion)
      await this.informacionRP.update(getOne.id, assinginformacion);
    }

    if (isVisitante) {
      getOne['ccomercial'] = null;
      getOne['tienda'] = null;
      ccomercial = null;
      tienda = null;
    }

    const objectUsers = Object.assign(getOne, {
      nombre,
      apellido,
      user,
      password,
      isVisitante,
      isTrabajaTienda,
      perfil,
      ccomercial,
      tienda,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status,
    })
    if (isEmptyUndefined(dto.password)) {
      delete objectUsers.password
    }

    delete getOne.informacion
    delete getOne.ccomerciales
    delete getOne.licencia

    await this.usersRP.update(getOne.id, objectUsers);

    const res = await this.getOne(dto.id);
    return res;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    await this.usersRP.update(id, { status: false });
    return await this.getOne(id);
  }

  async findUser(user: string) {
    return await this.usersRP
      .createQueryBuilder('user')
      .where({ user })
      .addSelect('user.password')
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

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {
    try {
      const data = {
        entidad: 'user',
        entId: parseInt(dto.user),
        referencia: parseInt(dto.isBack) == 0 ? 'image' : 'imageBack',
        refId: parseInt(dto.user),
      }
      const res = await this.galeriaService.create(file, data, userLogin)
      if (parseInt(dto.isBack) == 0) {
        await this.usersRP.update(parseInt(dto.user), {
          image: res.id
        });
      } else {
        await this.usersRP.update(parseInt(dto.user), {
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
    await this.usersRP.update(dto.user,
      dto.isBack ? { imageBack: dto.galeria } : { image: dto.galeria }
    );
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async asignarCComerciales(dto: AsignarCComercialesDto) {
    for (let i = 0; i < dto.ccomerciales.length; i++) {
      const data = {
        user: dto.user,
        ccomercial: dto.ccomerciales[i]
      };
      const findOne = await this.usersCComercialesRP.findOne({ where: data })
      if (isEmptyUndefined(findOne)) {
        await this.usersCComercialesRP.save(data);
      } else {
        await this.usersCComercialesRP.delete(findOne.id);
      }
    }
    return 1;
  }

  async getCComerciales(id: Number, options: IPaginationOptions): Promise<Pagination<UsersCComercialesEntity>> {
    const query = await this.usersCComercialesRP
      .createQueryBuilder("userCine")
      .leftJoinAndSelect("userCine.ccomercial", "cc")
      .leftJoinAndSelect("cc.image", "imgGal")
      .leftJoinAndSelect("cc.imageBack", "imgBackGal")
      .leftJoinAndSelect("cc.ciudad", "ciu")
      .select([
        'userCine.id',
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
      .where('userCine.user = :id', { id })
      .orderBy("cc.nombre", "ASC")
    query.getMany();
    return paginate<UsersCComercialesEntity>(query, options);
  }

}