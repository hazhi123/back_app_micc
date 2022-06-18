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
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { GaleriaService } from '../galeria/galeria.service';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  CreateImageDto,
  CreatePanoramasDto,
  CreateParametrosDto,
  GetAllDto,
  UpdateImageDto,
  UpdatePanoramasDto,
} from './dto';
import { PanoramasEntity } from './entities/panoramas.entity';

// import { PanoramasEntity } from './entities/panoramas.entity';

@Injectable()
export class PanoramasService {

  constructor(
    @InjectRepository(PanoramasEntity)
    private readonly panoramasRP: Repository<PanoramasEntity>,

    private galeriaService: GaleriaService

  ) { }

  async create(dto: CreatePanoramasDto, userLogin: UsuariosEntity) {
    const save = await this.panoramasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getOne(id: number): Promise<PanoramasEntity> {
    return await this.panoramasRP.findOne({
      relations: ['image'],
      where: { id },
    });
  }

  async update(dto: UpdatePanoramasDto, userLogin: UsuariosEntity) {
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    const assingUsers = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: Date(),
    })
    await this.panoramasRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsuariosEntity) {
    let galeriaId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: dto.entidad,
        entId: parseInt(dto.entId),
        referencia: 'panorama',
        refId: parseInt(dto.panorama),
      }
      res = await this.galeriaService.create(file, data, userLogin)
      galeriaId = res.id
    } catch (error) {
      galeriaId = null
      res = null
    }

    await this.panoramasRP.update(parseInt(dto.panorama),
      { image: galeriaId }
    );
    return await this.getOne(parseInt(dto.panorama));
  }

  async updateImage(dto: UpdateImageDto) {
    await this.panoramasRP.update(dto.panorama,
      { image: dto.galeria }
    );
    return await this.getOne(dto.panorama);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PanoramasEntity>> {
    const query = await this.panoramasRP
      .createQueryBuilder("pan")
      .leftJoinAndSelect("pan.image", "img")
      .select([
        'pan.id',
        'pan.nombre',
        'pan.desc',
        'pan.createdBy',
        'pan.createdAt',
        'pan.updatedBy',
        'pan.updatedAt',
        'pan.status',
        'pan.parametros',
        'img.id',
        'img.file',
      ])

    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('pan.ccomercial = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      query.andWhere('ciu.tiendaCC = :tienda', { tienda: dto.tienda })
    }
    if (!isEmptyUndefined(dto.cine)) {
      query.andWhere('pan.cineCC = :cine', { cine: dto.cine })
    }
    query.orderBy("pan.id", "DESC")
    query.getMany();
    return paginate<PanoramasEntity>(query, options);
  }

  async parametros(dto: CreateParametrosDto, userLogin: UsuariosEntity) {
    const getOne = await this.getOne(dto.panorama);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    if (dto.texto !== 'delete') {
      delete dto.panorama

      if (getOne.parametros === null) {
        getOne.parametros = [dto]
      } else {
        for (let index = 0; index < getOne.parametros.length; index++) {
          const element: any = getOne.parametros[index];
          if (element.latitud.toFixed(2) === dto.latitud.toFixed(2) && element.longitud.toFixed(2) === dto.longitud.toFixed(2)) {
            getOne.parametros.splice(index, 1)
          }
        }
        getOne.parametros.push(dto)
      }
      const assingUsers = Object.assign(getOne, {
        updatedBy: userLogin.id,
        updatedAt: Date(),
      })
      await this.panoramasRP.update(getOne.id, assingUsers);
    } else {
      for (let index = 0; index < getOne.parametros.length; index++) {
        const element: any = getOne.parametros[index];
        if (element.latitud.toFixed(2) === dto.latitud.toFixed(2) && element.longitud.toFixed(2) === dto.longitud.toFixed(2)) {
          getOne.parametros.splice(index, 1)
          await this.panoramasRP.update(dto.panorama, getOne)
        }
      }
    }

    return await this.getOne(getOne.id);
  }

}
