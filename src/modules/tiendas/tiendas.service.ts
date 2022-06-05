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
import { GaleriaService } from '../galeria/galeria.service';
import { ProductosEntity } from '../productos/entities/productos.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  AsignarCComercialDto,
  BorrarCComercialDto,
  CreateImageDto,
  CreateTiendasDto,
  GetAllDto,
  UpdateImageDto,
  UpdateTiendasDto,
} from './dto';
import {
  TiendasCComercialesEntity,
} from './entities/tiendas-ccomerciales.entity';
import { TiendasGaleriaEntity } from './entities/tiendas-galeria.entity';
import { TiendasEntity } from './entities/tiendas.entity';

@Injectable()
export class TiendasService {

  constructor(
    private galeriaService: GaleriaService,

    @InjectRepository(TiendasEntity)
    private readonly tiendasRP: Repository<TiendasEntity>,

    @InjectRepository(TiendasGaleriaEntity)
    private readonly tiendasGaleriaRP: Repository<TiendasGaleriaEntity>,

    @InjectRepository(TiendasCComercialesEntity)
    private readonly tiendasCComercialesRP: Repository<TiendasCComercialesEntity>,

    @InjectRepository(ProductosEntity)
    private readonly productosRP: Repository<ProductosEntity>,

  ) { }

  async create(dto: CreateTiendasDto, userLogin: UsuariosEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.tiendasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<TiendasEntity>> {
    const query = await this.tiendasRP
      .createQueryBuilder("tie")
      .leftJoinAndSelect("tie.image", "imgGal")
      .leftJoinAndSelect("tie.imageBack", "imgBackGal")
      .select([
        'tie.id',
        'tie.nombre',
        'tie.desc',
        'tie.isGastro',
        'tie.status',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
      ])
    if (!isEmptyUndefined(dto.isGastro)) {
      query.andWhere('tie.isGastro = :isGastro', { isGastro: dto.isGastro })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('tie.status = :status', { status: dto.status })
    }
    query.orderBy("tie.id", "DESC")
    query.getMany();
    return paginate<TiendasEntity>(query, options);
  }

  async getPublico(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<TiendasCComercialesEntity>> {
    const query = await this.tiendasCComercialesRP
      .createQueryBuilder("tieCC")
    query
      .leftJoinAndSelect("tieCC.ccomercial", "cc")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("tie.image", "imgGal")
      .leftJoinAndSelect("tie.imageBack", "imgBackGal")
      .select([
        'tieCC.id',
        'tieCC.correo',
        'tieCC.telPrimero',
        'tieCC.telSegundo',
        'tieCC.ubicacion',
        'tieCC.abierto',
        'tie.id',
        'tie.nombre',
        'tie.isGastro',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
      ])
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('tieCC.ccomercial = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('tieCC.categoria = :categoria', { categoria: dto.categoria })
    }
    if (!isEmptyUndefined(dto.isGastro)) {
      query.andWhere('tie.isGastro = :isGastro', { isGastro: dto.isGastro })
    }
    query.andWhere('tie.status = :status', { status: true })
    query.addOrderBy("tie.nombre", "ASC")

    query.getMany();
    return paginate<TiendasCComercialesEntity>(query, options);
  }

  async getOne(id: number): Promise<TiendasEntity> {
    const getOne = await this.tiendasRP
      .createQueryBuilder("ti")
      .leftJoinAndSelect("ti.image", "imgGal")
      .leftJoinAndSelect("ti.imageBack", "imgBackGal")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.desc',
        'ti.createdBy',
        'ti.createdAt',
        'ti.updatedBy',
        'ti.updatedAt',
        'ti.status',
        'ti.isGastro',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
      ])
      .where('ti.id = :id', { id })
      .getOne()
    // const getOne = await this.tiendasRP
    //   .createQueryBuilder("ti")
    //   .leftJoinAndSelect("ti.horarios", "hor")
    //   .leftJoinAndSelect("ti.categoria", "cat")
    //   .leftJoinAndSelect("ti.image", "imgGal")
    //   .leftJoinAndSelect("ti.imageBack", "imgBackGal")
    //   .leftJoinAndSelect("ti.files", "file")
    //   .leftJoinAndSelect("file.galeria", "gal")
    //   .select([
    //     'ti.id',
    //     'ti.nombre',
    //     'ti.correo',
    //     'ti.telPrimero',
    //     'ti.telSegundo',
    //     'ti.ubicacion',
    //     'ti.desc',
    //     'ti.createdBy',
    //     'ti.createdAt',
    //     'ti.updatedBy',
    //     'ti.updatedAt',
    //     'ti.status',
    //     'ti.ubicacion',
    //     'ti.abierto',
    //     'ti.isGastro',
    //     'hor.id',
    //     'hor.lunes',
    //     'hor.martes',
    //     'hor.miercoles',
    //     'hor.jueves',
    //     'hor.viernes',
    //     'hor.sabado',
    //     'hor.domingo',
    //     'hor.feriados',
    //     'cat.id',
    //     'cat.nombre',
    //     'imgGal.id',
    //     'imgGal.file',
    //     'imgBackGal.id',
    //     'imgBackGal.file',
    //     'file.id',
    //     'file.index',
    //     'gal.id',
    //     'gal.file',
    //   ])
    //   .where('ti.id = :id', { id })
    //   .getOne()

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdateTiendasDto, userLogin: UsuariosEntity) {
    const findNombre = await this.findNombre(dto.nombre, true)
    if (!isEmptyUndefined(findNombre)) delete dto.nombre

    const getOne = await this.tiendasRP.findOne({ where: { id: dto.id } });
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    const assing = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    })
    const save = await this.tiendasRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    // await this.tiendasRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.tiendasRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsuariosEntity) {
    if ((parseInt(dto.isBack) == 0 || parseInt(dto.isBack) == 1) && dto.index === undefined) {
      try {
        const data = {
          entidad: 'tienda',
          entId: parseInt(dto.tienda),
          referencia: parseInt(dto.isBack) == 0 ? 'image' : 'imageBack',
          refId: parseInt(dto.tienda),
        }
        const res = await this.galeriaService.create(file, data, userLogin)
        if (parseInt(dto.isBack) == 0) {
          await this.tiendasRP.update(parseInt(dto.tienda), {
            image: res.id
          });
        } else {
          await this.tiendasRP.update(parseInt(dto.tienda), {
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

    try {
      const data = {
        entidad: 'tienda',
        entId: parseInt(dto.tienda),
        referencia: 'galeria',
        refId: parseInt(dto.tienda),
      }
      const res = await this.galeriaService.create(file, data, userLogin)

      const findOne = await this.tiendasGaleriaRP.findOne({
        where: {
          tiendaCC: dto.tienda,
          index: dto.index,
        }
      })
      if (!isEmptyUndefined(findOne)) {
        await this.tiendasGaleriaRP.update(findOne.id, {
          galeria: res.id
        });
      } else {
        await this.tiendasGaleriaRP.save({
          tiendaCC: parseInt(dto.tienda),
          index: parseInt(dto.index),
          galeria: res.id
        });
      }

      return await this.tiendasGaleriaRP.find({
        where: {
          tiendaCC: parseInt(dto.tienda),
        },
        relations: ['galeria'],
      });

    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: 'Error al registrar la imagen',
      }, HttpStatus.ACCEPTED)
    }
  }

  async updateImage(dto: UpdateImageDto) {
    await this.tiendasRP.update(dto.tienda,
      dto.isBack ? { imageBack: dto.galeria } : { image: dto.galeria }
    );
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async deleteGaleria(dto: CreateImageDto) {
    await this.tiendasGaleriaRP.delete(parseInt(dto.file));
    return await this.tiendasGaleriaRP.find({
      where: {
        tiendaCC: parseInt(dto.tienda),
      },
      relations: ['galeria'],
    });
  }

  async updateGaleria(dto: UpdateImageDto) {
    const findOne = await this.tiendasGaleriaRP.findOne({
      where: {
        tiendaCC: dto.tienda,
        index: dto.index,
      }
    })
    if (!isEmptyUndefined(findOne)) {
      await this.tiendasGaleriaRP.update(findOne.id, {
        galeria: dto.galeria,
      });
    } else {
      await this.tiendasGaleriaRP.save({
        tiendaCC: dto.tienda,
        index: dto.index,
        galeria: dto.galeria
      });
    }
    return await this.tiendasGaleriaRP.find({
      where: {
        tiendaCC: dto.tienda,
      },
      relations: ['galeria'],
    });
  }

  async actualizarApertura(dto: GetAllDto): Promise<TiendasCComercialesEntity> {
    await this.tiendasCComercialesRP.update(dto.id, {
      abierto: dto.abierto
    });
    return await this.tiendasCComercialesRP.findOne({ where: { id: dto.id } });
  }

  async asignarCComercial(dto: AsignarCComercialDto, userLogin: UsuariosEntity) {
    const data = {
      tienda: dto.tienda,
      ccomercial: dto.ccomercial,
    };
    const getOne = await this.tiendasCComercialesRP.findOne({
      where: data,
    })
    if (isEmptyUndefined(getOne)) {
      await this.tiendasCComercialesRP.save({
        ...dto,
        createdBy: userLogin.id,
        createdAt: new Date(),
        updatedBy: userLogin.id,
        updatedAt: new Date(),
        status: true
      });
    } else {
      const assing = Object.assign(getOne, {
        ...dto,
        updatedBy: userLogin.id,
        updatedAt: new Date(),
      })
      await this.tiendasCComercialesRP.save(assing);
    }
    const findOne = await this.tiendasCComercialesRP.findOne({
      where: data,
    })
    return findOne;
  }

  async borrarCComercial(dto: BorrarCComercialDto) {
    for (let i = 0; i < dto.ccomerciales.length; i++) {
      const data = {
        tienda: dto.tienda,
        ccomercial: dto.ccomerciales[i]
      };
      const findOne = await this.tiendasCComercialesRP.findOne({
        where: data,
        relations: ['ccomercial', 'ccomercial.ciudad'],
      })
      if (!isEmptyUndefined(findOne)) {
        const count = await this.productosRP.count({ tiendaCC: findOne.id })
        if (count > 0) {
          throw new HttpException({
            statusCode: HttpStatus.ACCEPTED,
            message: `La tienda no se puede eliminar del Centro Comercial ${findOne.ccomercial.nombre} de ${findOne.ccomercial.ciudad.ciudad}, porque tiene (${count}) productos asignados`,
          }, HttpStatus.ACCEPTED)
        }
      }

      await this.tiendasCComercialesRP.delete(findOne.id);
    }
    return 1;
  }

  async getCComerciales(id: Number, options: IPaginationOptions): Promise<Pagination<TiendasCComercialesEntity>> {
    const query = await this.tiendasCComercialesRP
      .createQueryBuilder("tieCC")
      .leftJoinAndSelect("tieCC.ccomercial", "cc")
      .leftJoinAndSelect("tieCC.categoria", "cat")
      .leftJoinAndSelect("tieCC.horarios", "hor")
      .leftJoinAndSelect("tieCC.files", "file")
      .leftJoinAndSelect("file.galeria", "gal")
      .leftJoinAndSelect("cc.image", "imgGal")
      .leftJoinAndSelect("cc.imageBack", "imgBackGal")
      .leftJoinAndSelect("cc.ciudad", "ciu")
      .select([
        'tieCC.id',
        'tieCC.correo',
        'tieCC.ubicacion',
        'tieCC.telefonos',
        'tieCC.abierto',
        'tieCC.status',
        'cat.id',
        'cat.nombre',
        'cc.id',
        'cc.nombre',
        'cc.direccion',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'ciu.id',
        'ciu.ciudad',
        'hor.id',
        'hor.lunes',
        'hor.martes',
        'hor.miercoles',
        'hor.jueves',
        'hor.viernes',
        'hor.sabado',
        'hor.domingo',
        'hor.feriados',
        'file.id',
        'file.index',
        'gal.id',
        'gal.file',
      ])
      .where('tieCC.tienda = :id', { id })
      .orderBy("cc.nombre", "ASC")
    query.getMany();
    return paginate<TiendasCComercialesEntity>(query, options);
  }

}
