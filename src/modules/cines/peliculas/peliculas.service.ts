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
import { GaleriaService } from '../../galeria/galeria.service';
import { UsersEntity } from '../../users/entities/users.entity';
import {
  AsignarCinesDto,
  CreateImageDto,
  CreatePeliculasDto,
  GetAllDto,
  UpdateImageDto,
  UpdatePeliculasDto,
} from './dto';
import { PeliculasCinesEntity } from './entities/peliculas-cines.entity';
import { PeliculasEntity } from './entities/peliculas.entity';

@Injectable()
export class PeliculasService {

  relations = []

  constructor(
    @InjectRepository(PeliculasEntity)
    private readonly peliculasRP: Repository<PeliculasEntity>,

    @InjectRepository(PeliculasCinesEntity)
    private readonly peliculasCinesRP: Repository<PeliculasCinesEntity>,

    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreatePeliculasDto, userLogin: UsersEntity) {
    await this.findNombre(dto.nombre, false)
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
        'peli.status',
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
      .leftJoinAndSelect("peli.peliculas", "cine")
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
      .select([
        'peli.id',
        'peli.nombre',
        'peli.genero',
        'peli.duracion',
        'peli.sinopsis',
        'peli.status',
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
    const getOne = await this.getOne(dto.id); const findNombre = await this.findNombre(dto.nombre, true)
    if (!isEmptyUndefined(findNombre)) delete dto.nombre

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
    // await this.peliculasRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.peliculasRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {
    try {
      const data = {
        entidad: 'pelicula',
        entId: parseInt(dto.pelicula),
        referencia: parseInt(dto.isTrailer) == 1 ? 'trailer' : parseInt(dto.isBack) == 0 ? 'image' : 'imageBack',
        refId: parseInt(dto.pelicula),
      }
      const res = await this.galeriaService.create(file, data, userLogin)

      if (parseInt(dto.isTrailer) == 0) {
        if (parseInt(dto.isBack) == 0) {
          await this.peliculasRP.update(parseInt(dto.pelicula), {
            image: res.id
          });
        } else {
          await this.peliculasRP.update(parseInt(dto.pelicula), {
            imageBack: res.id
          });
        }
      } else {
        await this.peliculasRP.update(parseInt(dto.pelicula), {
          trailer: res.id
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
    if (dto.isTrailer) {
      await this.peliculasRP.update(dto.pelicula,
        { trailer: dto.galeria }
      );
    } else {
      await this.peliculasRP.update(dto.pelicula,
        dto.isBack ? { imageBack: dto.galeria } : { image: dto.galeria }
      );

    }
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async asignarCines(dto: AsignarCinesDto) {
    for (let i = 0; i < dto.cines.length; i++) {
      const data = {
        pelicula: dto.pelicula,
        cineCC: dto.cines[i]
      };
      const findOne = await this.peliculasCinesRP.findOne({ where: data })
      if (isEmptyUndefined(findOne)) {
        await this.peliculasCinesRP.save(data);
      } else {
        await this.peliculasCinesRP.delete(findOne.id);
      }
    }
    return 1;
  }

  async getCines(id: Number, options: IPaginationOptions): Promise<Pagination<PeliculasCinesEntity>> {
    const query = await this.peliculasCinesRP
      .createQueryBuilder("pCine")
      .leftJoinAndSelect("pCine.cineCC", "cCC")
      .leftJoinAndSelect("cCC.cine", "cine")
      .leftJoinAndSelect("cine.image", "imgGal")
      .leftJoinAndSelect("cine.imageBack", "imgBackGal")
      .leftJoinAndSelect("cCC.ccomercial", "cc")
      .leftJoinAndSelect("cc.ciudad", "ciu")
      .select([
        'pCine.id',
        'cCC.id',
        'cCC.ubicacion',
        'cine.id',
        'cine.nombre',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'cc.id',
        'cc.nombre',
        'ciu.id',
        'ciu.ciudad',
      ])
      .where('pCine.pelicula = :id', { id })
      .orderBy("cc.nombre", "ASC")
      .addOrderBy("cine.nombre", "ASC")
    query.getMany();
    return paginate<PeliculasCinesEntity>(query, options);
  }

}
