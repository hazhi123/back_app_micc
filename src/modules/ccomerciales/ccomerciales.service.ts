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
import { GaleriaService } from '../galeria/galeria.service';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateCComercialesDto,
  CreateImageDto,
  GetAllDto,
  UpdateCComercialesDto,
  UpdateImageDto,
} from './dto';
import {
  CComercialesGaleriaEntity,
} from './entities/ccomerciales-galeria.entity';
import { CComercialesEntity } from './entities/ccomerciales.entity';

@Injectable()
export class CComercialesService {

  constructor(
    @InjectRepository(CComercialesEntity)
    private readonly ccomercialesRP: Repository<CComercialesEntity>,

    @InjectRepository(CComercialesGaleriaEntity)
    private readonly ccomercialesGaleriaRP: Repository<CComercialesGaleriaEntity>,

    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreateCComercialesDto, userLogin: UsersEntity) {
    const save = await this.ccomercialesRP.save({
      ...dto,
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
      .leftJoinAndSelect("cc.ciudad", "ciu")
      .leftJoinAndSelect("cc.image", "imgGal")
      .leftJoinAndSelect("cc.imageBack", "imgBackGal")
      .leftJoinAndSelect("cc.tiendas", "tie")
      .leftJoinAndSelect("ciu.estado", "edo")
      .select([
        'cc.id',
        'cc.nombre',
        'cc.telPrimero',
        'cc.direccion',
        'cc.abierto',
        'cc.status',
        'ciu.id',
        'ciu.ciudad',
        'edo.id',
        'edo.estado',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
      ])
      .loadRelationCountAndMap('cc.totalTiendas', 'cc.tiendas')

    if (!isEmptyUndefined(dto.ciudad)) {
      query.andWhere('cc.ciudad = :ciudad', { ciudad: dto.ciudad })
    }
    if (!isEmptyUndefined(dto.pais)) {
      query.andWhere('ciu.pais = :pais', { pais: dto.pais })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('cc.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.abierto)) {
      query.andWhere('cc.abierto = :abierto', { abierto: dto.abierto })
    }
    query.addOrderBy("cc.nombre", "ASC")

    query.getMany();
    return paginate<CComercialesEntity>(query, options);
  }

  async getOne(id: number): Promise<CComercialesEntity> {
    const getOne = await this.ccomercialesRP
      .createQueryBuilder("cc")
      .leftJoinAndSelect("cc.ciudad", "ciu")
      .leftJoinAndSelect("ciu.estado", "edo")
      .leftJoinAndSelect("edo.pais", "pais")
      .leftJoinAndSelect("cc.horarios", "hor")
      .leftJoinAndSelect("cc.image", "imgGal")
      .leftJoinAndSelect("cc.imageBack", "backGal")
      .leftJoinAndSelect("cc.files", "file")
      .leftJoinAndSelect("file.galeria", "gal")
      .select([
        'cc.id',
        'cc.nombre',
        'cc.correo',
        'cc.telPrimero',
        'cc.telSegundo',
        'cc.direccion',
        'cc.ubicLatLng',
        'cc.desc',
        'cc.abierto',
        'cc.createdBy',
        'cc.createdAt',
        'cc.updatedBy',
        'cc.updatedAt',
        'cc.status',
        'ciu.id',
        'ciu.ciudad',
        'edo.id',
        'edo.estado',
        'pais.id',
        'pais.nombre',
        'hor.id',
        'hor.lunes',
        'hor.martes',
        'hor.miercoles',
        'hor.jueves',
        'hor.viernes',
        'hor.sabado',
        'hor.domingo',
        'hor.feriados',
        'imgGal.id',
        'imgGal.file',
        'backGal.id',
        'backGal.file',
        'file.id',
        'file.index',
        'gal.id',
        'gal.file',
      ])
      .where('cc.id = :id', { id })
      .getOne()

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
    // await this.ccomercialesRP.delete(id);
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
    if (!isEmptyUndefined(dto.isBack) && isEmptyUndefined(dto.index)) {
      try {
        const data = {
          entidad: 'ccomercial',
          entId: parseInt(dto.ccomercial),
          referencia: 'image',
          refId: parseInt(dto.ccomercial),
        }
        const res = await this.galeriaService.create(file, data, userLogin)
        const galeriaId = res.id
        if (parseInt(dto.isBack) == 0) {
          await this.ccomercialesRP.update(parseInt(dto.ccomercial), {
            image: galeriaId
          });
        } else {
          await this.ccomercialesRP.update(parseInt(dto.ccomercial), {
            imageBack: galeriaId
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
        entidad: 'ccomercial',
        entId: parseInt(dto.ccomercial),
        referencia: 'galeria',
        refId: parseInt(dto.ccomercial),
      }
      const res = await this.galeriaService.create(file, data, userLogin)

      if (isEmptyUndefined(dto.vieja)) {
        await this.ccomercialesGaleriaRP.save({
          index: parseInt(dto.index),
          ccomercial: parseInt(dto.ccomercial),
          galeria: res.id
        });
      } else {
        const findOne = await this.ccomercialesGaleriaRP.findOne({
          where: {
            galeria: dto.vieja,
            ccomercial: dto.ccomercial,
          }
        })
        if (!isEmptyUndefined(findOne)) {
          await this.ccomercialesGaleriaRP.update(findOne.id, {
            galeria: res.id
          });
        } else {
          await this.ccomercialesGaleriaRP.save({
            index: parseInt(dto.index),
            ccomercial: parseInt(dto.ccomercial),
            galeria: res.id
          });
        }
      }

      return await this.getOne(parseInt(dto.ccomercial));
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: 'Error al registrar la imagen',
      }, HttpStatus.ACCEPTED)
    }
  }

  async updateImage(dto: UpdateImageDto) {
    await this.ccomercialesRP.update(dto.ccomercial,
      dto.isBack ? { imageBack: dto.galeria } : { image: dto.galeria }
    );
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async deleteGaleria(dto: CreateImageDto) {
    await this.ccomercialesGaleriaRP.delete(parseInt(dto.file));
    return await this.getOne(parseInt(dto.ccomercial));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const findOne = await this.ccomercialesGaleriaRP.findOne({
      where: {
        galeria: dto.vieja,
        ccomercial: dto.ccomercial,
      }
    })
    if (!isEmptyUndefined(findOne)) {
      await this.ccomercialesGaleriaRP.update(findOne.id, {
        galeria: dto.galeria,
      });
    } else {
      await this.ccomercialesGaleriaRP.save({
        index: dto.index,
        ccomercial: dto.ccomercial,
        galeria: dto.galeria
      });
    }
    return await this.getOne(dto.ccomercial);
  }



}
