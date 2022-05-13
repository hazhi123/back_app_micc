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

import * as CONST from '../../../common/constants';
import { isEmptyUndefined } from '../../../common/helpers';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { GaleriaService } from '../../galeria/galeria.service';
import { UsersEntity } from '../../users/entities/users.entity';
import {
  CreateImageDto,
  CreatePeliculasDto,
  GetAllDto,
  UpdateImageDto,
  UpdatePeliculasDto,
} from './dto';
import { PeliculasEntity } from './entities/peliculas.entity';

@Injectable()
export class PeliculasService {

  relations = []

  constructor(
    @InjectRepository(PeliculasEntity)
    private readonly peliculasRP: Repository<PeliculasEntity>,

    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreatePeliculasDto, userLogin: UsersEntity) {
    const save = await this.peliculasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PeliculasEntity>> {
    const query = await this.peliculasRP
      .createQueryBuilder("peli")
      .leftJoinAndSelect("peli.image", "imgGal")
      .leftJoinAndSelect("peli.imageBack", "imgBackGal")
      .select([
        'peli.id',
        'peli.nombre',
        'peli.genero',
        'peli.duracion',
        'peli.sinopsis',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file'
      ])

    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('peli.status = :status', { status: dto.status })
    }
    query.orderBy("peli.id", "DESC")
    query.getMany();
    return paginate<PeliculasEntity>(query, options);
  }

  async getAllPublico(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PeliculasEntity>> {
    const query = await this.peliculasRP
      .createQueryBuilder("peli")
      .leftJoinAndSelect("peli.image", "imgGal")
      .leftJoinAndSelect("peli.imageBack", "imgBackGal")
      .leftJoinAndSelect("peli.cines", "cine")
      .select([
        'peli.id',
        'peli.nombre',
        'peli.genero',
        'peli.duracion',
        'peli.sinopsis',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file'
      ])
      .where('cine.id = :cine', { cine: dto.cine })
      .andWhere('peli.status = :status', { status: true })
      .addOrderBy("peli.nombre", "ASC")
    query.getMany();
    return paginate<PeliculasEntity>(query, options);
  }

  async getOne(id: number): Promise<PeliculasEntity> {
    const getOne = await this.peliculasRP
      .createQueryBuilder("peli")
      .leftJoinAndSelect("peli.image", "imgGal")
      .leftJoinAndSelect("peli.imageBack", "imgBackGal")
      .leftJoinAndSelect("peli.trailer", "trai")
      .leftJoinAndSelect("peli.cines", "cine")
      .select([
        'peli.id',
        'peli.nombre',
        'peli.genero',
        'peli.duracion',
        'peli.sinopsis',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'trai.id',
        'trai.file'
      ])
      .where('peli.id = :id', { id })
      .getOne()

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdatePeliculasDto, userLogin: UsersEntity) {
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    const data = {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    };
    await this.peliculasRP.update(getOne.id, data);
    return await this.getOne(dto.id);;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.peliculasRP.delete(id);
    return getOne;
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {

    let galeriaId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: 'cine',
        entId: parseInt(dto.cine),
        referencia: 'pelicula',
        refId: parseInt(dto.cine),
      }
      res = await this.galeriaService.create(file, data, userLogin)
      galeriaId = res.id
    } catch (error) {
      galeriaId = null
      res = null
    }

    if (parseInt(dto.isBack) == 0) {
      await this.peliculasRP.update(parseInt(dto.cine), {
        image: galeriaId
      });
    } else {
      await this.peliculasRP.update(parseInt(dto.cine), {
        imageBack: galeriaId
      });
    }

    return res;
  }

  async updateImage(dto: UpdateImageDto) {
    await this.peliculasRP.update(dto.cine,
      dto.isBack ? { imageBack: dto.galeria } : { image: dto.galeria }
    );
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

}
