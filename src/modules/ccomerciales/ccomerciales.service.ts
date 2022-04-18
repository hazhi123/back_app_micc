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
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { GaleriaService } from '../galeria/galeria.service';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateCComercialesDto,
  CreateImageDto,
  GetAllDto,
  UpdateCComercialesDto,
  UpdateImageDto,
} from './dto';
import { CComercialesEntity } from './entities/ccomerciales.entity';

@Injectable()
export class CComercialesService {

  constructor(
    @InjectRepository(CComercialesEntity)
    private readonly ccomercialesRP: Repository<CComercialesEntity>,

    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreateCComercialesDto, userLogin: UsersEntity) {
    let galeria = []
    for (let x = 0; x < 9; x++) {
      galeria.push('0')
    }

    const save = await this.ccomercialesRP.save({
      ...dto,
      galeria,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<CComercialesEntity>> {
    const query = await this.ccomercialesRP
      .createQueryBuilder("cc")
    query
      .leftJoinAndSelect("cc.pais", "pais")
      .leftJoinAndSelect("cc.ciudad", "ciudad")
      .leftJoinAndSelect("cc.image", "gal")
      .select([
        'cc.id',
        'cc.nombre',
        'cc.telPrimero',
        'cc.direccion',
        'cc.totalTiendas',
        'cc.abierto',
        'cc.status',
        'pais.id',
        'pais.nombre',
        'ciudad.id',
        'ciudad.nombre',
        'gal.id',
        'gal.file',
      ])

    if (!isEmptyUndefined(dto.pais)) {
      query.andWhere('cc.pais = :pais', { pais: dto.pais })
    }
    if (!isEmptyUndefined(dto.ciudad)) {
      query.andWhere('cc.ciudad = :ciudad', { ciudad: dto.ciudad })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('cc.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.abierto)) {
      query.andWhere('cc.abierto = :abierto', { abierto: dto.abierto })
    }
    query.orderBy("pais.nombre", "ASC")
    query.addOrderBy("ciudad.nombre", "ASC")
    query.addOrderBy("cc.nombre", "ASC")

    query.getMany();
    return paginate<CComercialesEntity>(query, options);
  }

  async getOne(id: number, isGaleria: boolean = true): Promise<CComercialesEntity> {
    const getOne = await this.ccomercialesRP
      .createQueryBuilder("cc")
      .leftJoinAndSelect("cc.pais", "pais")
      .leftJoinAndSelect("cc.ciudad", "ciudad")
      .leftJoinAndSelect("cc.horarios", "hor")
      .leftJoinAndSelect("cc.image", "gal")
      .select([
        'cc.id',
        'cc.nombre',
        'cc.correo',
        'cc.telPrimero',
        'cc.telSegundo',
        'cc.galeria',
        'cc.direccion',
        'cc.ubicLatLng',
        'cc.totalTiendas',
        'cc.desc',
        'cc.abierto',
        'cc.createdBy',
        'cc.createdAt',
        'cc.updatedBy',
        'cc.updatedAt',
        'cc.status',
        'pais.id',
        'pais.nombre',
        'ciudad.id',
        'ciudad.nombre',
        'hor.id',
        'hor.lunes',
        'hor.martes',
        'hor.miercoles',
        'hor.jueves',
        'hor.viernes',
        'hor.sabado',
        'hor.domingo',
        'hor.feriados',
        'gal.id',
        'gal.file',
      ])
      .where('cc.id = :id', { id })
      .getOne()

    if (isGaleria) {
      for (let x = 0; x < getOne.galeria.length; x++) {
        if (getOne.galeria[x] != '0') {
          getOne.galeria[x] = await this.galeriaService.getOne(parseInt(getOne.galeria[x]));
        }
      }
    }
    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async actualizarApertura(dto: GetAllDto): Promise<CComercialesEntity> {
    await this.ccomercialesRP.update(dto.id, {
      abierto: dto.abierto
    });
    return await this.getOne(dto.id);
  }

  async update(dto: UpdateCComercialesDto, userLogin: UsersEntity) {
    if (isEmptyUndefined(userLogin)) throw new NotFoundException(CONST.MESSAGES.COMMON.ERROR.ROLES);
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    const assing = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    })
    const save = await this.ccomercialesRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.ccomercialesRP.delete(id);
    return getOne;
  }


  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.ccomercialesRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {
    const dato = await this.getOne(parseInt(dto.ccomercial), false);
    let galeria = dato.galeria
    let image

    if (isEmptyUndefined(dto.index)) {
      let galeriaId;
      let res: GaleriaEntity
      try {
        const data = {
          entidad: 'ccomercial',
          entId: parseInt(dto.ccomercial),
          referencia: 'image',
          refId: parseInt(dto.ccomercial),
        }
        res = await this.galeriaService.create(file, data, userLogin)
        galeriaId = res.id
      } catch (error) {
        galeriaId = null
        res = null
      }

      await this.ccomercialesRP.update(parseInt(dto.ccomercial), {
        image: galeriaId
      });
      return res;
    }

    let galeriaId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: 'ccomercial',
        entId: parseInt(dto.ccomercial),
        referencia: 'galeria',
        refId: parseInt(dto.ccomercial),
      }
      res = await this.galeriaService.create(file, data, userLogin)
      galeriaId = res.id
    } catch (error) {
      galeriaId = null
      res = null
    }

    for (let x = 0; x < 9; x++) {
      if (x == parseInt(dto.index)) {
        galeria[x] = galeriaId
      }
      if (isEmptyUndefined(galeria[x])) {
        galeria[x] = '0'
      }
    }
    await this.ccomercialesRP.update(parseInt(dto.ccomercial), {
      galeria
    });
    return await this.getOne(parseInt(dto.ccomercial));
  }

  async updateImage(dto: UpdateImageDto) {
    await this.ccomercialesRP.update(dto.ccomercial, {
      image: dto.galeria
    });
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async deleteGaleria(dto: CreateImageDto) {
    const data = await this.getOne(parseInt(dto.ccomercial), false);
    data.galeria[parseInt(dto.index)] = '0'
    await this.ccomercialesRP.update(parseInt(dto.ccomercial), {
      galeria: data.galeria
    });
    return await this.getOne(parseInt(dto.ccomercial));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const data = await this.getOne(dto.ccomercial, false);
    data.galeria[dto.index] = dto.galeria
    await this.ccomercialesRP.update(dto.ccomercial, {
      galeria: data.galeria
    });
    return await this.getOne(dto.ccomercial);
  }



}
