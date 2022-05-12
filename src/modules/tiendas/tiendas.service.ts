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
  CreateImageDto,
  CreateTiendasDto,
  GetAllDto,
  UpdateImageDto,
  UpdateTiendasDto,
} from './dto';
import { TiendasGaleriaEntity } from './entities/tiendas-galeria.entity';
import { TiendasEntity } from './entities/tiendas.entity';

@Injectable()
export class TiendasService {

  constructor(
    @InjectRepository(TiendasEntity)
    private readonly tiendasRP: Repository<TiendasEntity>,

    @InjectRepository(TiendasGaleriaEntity)
    private readonly tiendasGaleriaRP: Repository<TiendasGaleriaEntity>,


    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreateTiendasDto, userLogin: UsersEntity) {
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
      .createQueryBuilder("ti")
    query
      .leftJoinAndSelect("ti.ccomercial", "cc")
      .leftJoinAndSelect("ti.categoria", "cat")
      .leftJoinAndSelect("ti.image", "imgGal")
      .leftJoinAndSelect("ti.imageBack", "imgBackGal")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.correo',
        'ti.telPrimero',
        'ti.ubicacion',
        'ti.likes',
        'ti.isGastro',
        'ti.status',
        'ti.abierto',
        'cc.id',
        'cc.nombre',
        'cat.id',
        'cat.nombre',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
      ])

    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :categoria', { categoria: dto.categoria })
    }
    if (!isEmptyUndefined(dto.isGastro)) {
      query.andWhere('ti.isGastro = :isGastro', { isGastro: dto.isGastro })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('ti.status = :status', { status: dto.status })
    }
    query.addOrderBy("ti.nombre", "ASC")

    query.getMany();
    return paginate<TiendasEntity>(query, options);
  }

  async getAllPublico(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<TiendasEntity>> {
    const query = await this.tiendasRP
      .createQueryBuilder("ti")
    query
      .leftJoinAndSelect("ti.ccomercial", "cc")
      .leftJoinAndSelect("ti.categoria", "cat")
      .leftJoinAndSelect("ti.image", "imgGal")
      .leftJoinAndSelect("ti.imageBack", "imgBackGal")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.ubicacion',
        'ti.isGastro',
        'ti.abierto',
        'cat.id',
        'cat.nombre',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
      ])
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :categoria', { categoria: dto.categoria })
    }
    if (!isEmptyUndefined(dto.isGastro)) {
      query.andWhere('ti.isGastro = :isGastro', { isGastro: dto.isGastro })
    }
    query.andWhere('ti.status = :status', { status: true })
    query.addOrderBy("ti.nombre", "ASC")

    query.getMany();
    return paginate<TiendasEntity>(query, options);
  }

  async getOne(id: number): Promise<TiendasEntity> {
    const getOne = await this.tiendasRP
      .createQueryBuilder("ti")
      .leftJoinAndSelect("ti.horarios", "hor")
      .leftJoinAndSelect("ti.categoria", "cat")
      .leftJoinAndSelect("ti.image", "imgGal")
      .leftJoinAndSelect("ti.imageBack", "imgBackGal")
      .leftJoinAndSelect("ti.files", "file")
      .leftJoinAndSelect("file.galeria", "gal")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.correo',
        'ti.telPrimero',
        'ti.telSegundo',
        'ti.ubicacion',
        'ti.likes',
        'ti.desc',
        'ti.createdBy',
        'ti.createdAt',
        'ti.updatedBy',
        'ti.updatedAt',
        'ti.status',
        'ti.ubicacion',
        'ti.abierto',
        'ti.isGastro',
        'hor.id',
        'hor.lunes',
        'hor.martes',
        'hor.miercoles',
        'hor.jueves',
        'hor.viernes',
        'hor.sabado',
        'hor.domingo',
        'hor.feriados',
        'cat.id',
        'cat.nombre',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'file.id',
        'file.index',
        'gal.id',
        'gal.file',
      ])
      .where('ti.id = :id', { id })
      .getOne()

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdateTiendasDto, userLogin: UsersEntity) {
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

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {
    // const dato = await this.getOne(parseInt(dto.tienda), false);

    if (isEmptyUndefined(dto.index)) {
      let galeriaId;
      let res: GaleriaEntity
      try {
        const data = {
          entidad: 'tienda',
          entId: parseInt(dto.tienda),
          referencia: 'image',
          refId: parseInt(dto.tienda),
        }
        res = await this.galeriaService.create(file, data, userLogin)
        galeriaId = res.id
      } catch (error) {
        galeriaId = null
        res = null
      }

      if (parseInt(dto.isBack) == 0) {
        await this.tiendasRP.update(parseInt(dto.tienda), {
          image: galeriaId
        });
      } else {
        await this.tiendasRP.update(parseInt(dto.tienda), {
          imageBack: galeriaId
        });
      }

      await this.tiendasRP.update(parseInt(dto.tienda), {
        image: galeriaId
      });
      return res;
    }

    let galeriaId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: 'tienda',
        entId: parseInt(dto.tienda),
        referencia: 'galeria',
        refId: parseInt(dto.tienda),
      }
      res = await this.galeriaService.create(file, data, userLogin)
      galeriaId = res.id
    } catch (error) {
      galeriaId = null
      res = null
    }

    await this.tiendasGaleriaRP.save({
      index: parseInt(dto.index),
      ccomercial: parseInt(dto.tienda),
      galeria: res.id
    });

    return await this.getOne(parseInt(dto.tienda));
  }

  async updateImage(dto: UpdateImageDto) {
    await this.tiendasRP.update(dto.tienda, {
      image: dto.galeria
    });
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async deleteGaleria(dto: CreateImageDto) {
    await this.tiendasGaleriaRP.delete(parseInt(dto.file));
    return await this.getOne(parseInt(dto.tienda));
  }

  async updateGaleria(dto: UpdateImageDto) {
    await this.tiendasGaleriaRP.update(dto.file, {
      index: dto.index,
      tienda: dto.tienda,
      galeria: dto.galeria
    });
    return await this.getOne(dto.tienda);
  }

  async actualizarApertura(dto: GetAllDto): Promise<TiendasEntity> {
    await this.tiendasRP.update(dto.id, {
      abierto: dto.abierto
    });
    return await this.getOne(dto.id);
  }

}
