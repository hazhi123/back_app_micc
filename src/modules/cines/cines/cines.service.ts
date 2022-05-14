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
import {
  CComercialesCinesEntity,
} from '../../ccomerciales/entities/ccomerciales-cines.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { GaleriaService } from '../../galeria/galeria.service';
import { UsersEntity } from '../../users/entities/users.entity';
import {
  AsignarCComercialesDto,
  AsignarPeliculasDto,
  CreateCinesDto,
  CreateImageDto,
  GetAllDto,
  UpdateCinesDto,
  UpdateImageDto,
} from './dto';
import { CinesGaleriaEntity } from './entities/cines-galeria.entity';
import { CinesPeliculasEntity } from './entities/cines-peliculas.entity';
import { CinesEntity } from './entities/cines.entity';

@Injectable()
export class CinesService {

  constructor(
    @InjectRepository(CinesEntity)
    private readonly cinesRP: Repository<CinesEntity>,

    @InjectRepository(CinesGaleriaEntity)
    private readonly cinesGaleriaRP: Repository<CinesGaleriaEntity>,

    @InjectRepository(CinesPeliculasEntity)
    private readonly cinesPeliculasRP: Repository<CinesPeliculasEntity>,

    @InjectRepository(CComercialesCinesEntity)
    private readonly cinesCComercialesRP: Repository<CComercialesCinesEntity>,

    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreateCinesDto, userLogin: UsersEntity) {
    await this.findNombre(dto.nombre, false)

    const save = await this.cinesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async asignarPeliculas(dto: AsignarPeliculasDto) {
    for (let i = 0; i < dto.peliculas.length; i++) {
      const data = {
        cine: dto.cine,
        pelicula: dto.peliculas[i]
      };
      const findOne = await this.cinesPeliculasRP.findOne({ where: data })
      if (isEmptyUndefined(findOne)) {
        await this.cinesPeliculasRP.save(data);
      }
    }
    return await this.getOne(dto.cine);
  }

  async asignarCComerciales(dto: AsignarCComercialesDto) {
    for (let i = 0; i < dto.ccomerciales.length; i++) {
      const data = {
        cine: dto.cine,
        ccomercial: dto.ccomerciales[i]
      };
      const findOne = await this.cinesCComercialesRP.findOne({ where: data })
      if (isEmptyUndefined(findOne)) {
        await this.cinesCComercialesRP.save(data);
      }
    }
    return await this.getOne(dto.cine);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<CinesEntity>> {
    const query = await this.cinesRP
      .createQueryBuilder("cine")
      .leftJoinAndSelect("cine.image", "imgGal")
      .leftJoinAndSelect("cine.imageBack", "imgBackGal")
      .leftJoinAndSelect("cine.ccomerciales", "cc")
      .select([
        'cine.id',
        'cine.nombre',
        'cine.desc',
        'cine.status',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file'
      ])
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('cine.status = :status', { status: dto.status })
    }
    query.orderBy("cine.id", "DESC")
    query.getMany();
    return paginate<CinesEntity>(query, options);
  }

  async getAllPublico(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<CinesEntity>> {
    const query = await this.cinesRP
      .createQueryBuilder("cine")
      .leftJoinAndSelect("cine.image", "imgGal")
      .leftJoinAndSelect("cine.imageBack", "imgBackGal")
      .leftJoinAndSelect("cine.ccomerciales", "cc")
      .select([
        'cine.id',
        'cine.nombre',
        'cine.desc',
        'cine.status',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
      ])
      .where('cc.id = :ccomercial', { ccomercial: dto.ccomercial })
      .andWhere('cine.status = :status', { status: true })
      .addOrderBy("cine.nombre", "ASC")

    query.getMany();
    return paginate<CinesEntity>(query, options);
  }

  async getOne(id: number): Promise<CinesEntity> {
    const getOne = await this.cinesRP
      .createQueryBuilder("cine")
      .leftJoinAndSelect("cine.image", "imgGal")
      .leftJoinAndSelect("cine.imageBack", "imgBackGal")
      .leftJoinAndSelect("cine.ccomerciales", "cc")
      .leftJoinAndSelect("cc.ccomercial", "ccCC")
      .leftJoinAndSelect("cine.funciones", "fun")
      .leftJoinAndSelect("fun.pelicula", "funPel")
      .select([
        'cine.id',
        'cine.nombre',
        'cine.desc',
        'cine.status',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'cc.id',
        'ccCC.id',
        'ccCC.nombre',
        'fun.id',
        'funPel.id',
        'funPel.nombre',
      ])
      .where('cine.id = :id', { id })
      .getOne()

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdateCinesDto, userLogin: UsersEntity) {
    const findNombre = await this.findNombre(dto.nombre, true)
    if (!isEmptyUndefined(findNombre)) delete dto.nombre

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
    await this.cinesRP.update(getOne.id, data);
    return await this.getOne(dto.id);;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.cinesRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.cinesRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {
    // const getOne = await this.getOne(parseInt(dto.ccomercial));

    if (isEmptyUndefined(dto.index)) {
      let galeriaId;
      let res: GaleriaEntity
      try {
        const data = {
          entidad: 'ccomercial',
          entId: parseInt(dto.cine),
          referencia: 'cine',
          refId: parseInt(dto.cine),
        }
        res = await this.galeriaService.create(file, data, userLogin)
        galeriaId = res.id
      } catch (error) {
        galeriaId = null
        res = null
      }

      if (parseInt(dto.isBack) == 0) {
        await this.cinesRP.update(parseInt(dto.cine), {
          image: galeriaId
        });
      } else {
        await this.cinesRP.update(parseInt(dto.cine), {
          imageBack: galeriaId
        });
      }

      return res;
    }

  }

  async updateImage(dto: UpdateImageDto) {
    await this.cinesRP.update(dto.cine,
      dto.isBack ? { imageBack: dto.galeria } : { image: dto.galeria }
    );
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

}
