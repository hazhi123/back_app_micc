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
import {
  CinesCComercialesEntity,
} from '../cines/cines/entities/cines-ccomerciales.entity';
import { GaleriaService } from '../galeria/galeria.service';
import { PanoramasEntity } from '../panoramas/entities/panoramas.entity';
import { PanoramasService } from '../panoramas/panoramas.service';
import {
  TiendasCComercialesEntity,
} from '../tiendas/entities/tiendas-ccomerciales.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
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

    @InjectRepository(CinesCComercialesEntity)
    private readonly cinesCComercialesRP: Repository<CinesCComercialesEntity>,

    @InjectRepository(TiendasCComercialesEntity)
    private readonly tiendasCComercialesRP: Repository<TiendasCComercialesEntity>,

    private galeriaService: GaleriaService,

    private panoramasService: PanoramasService,

    @InjectRepository(PanoramasEntity)
    private readonly panoramasRP: Repository<PanoramasEntity>,

  ) { }

  async create(dto: CreateCComercialesDto, userLogin: UsuariosEntity) {
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
      .leftJoinAndSelect("ciu.estado", "edo")
      .leftJoinAndSelect("edo.pais", "pais")
      .select([
        'cc.id',
        'cc.nombre',
        'cc.telPrimero',
        'cc.correo',
        'cc.direccion',
        'cc.abierto',
        'cc.status',
        'ciu.id',
        'ciu.ciudad',
        'edo.id',
        'edo.estado',
        'pais.id',
        'pais.nombre',
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
    query.orderBy("cc.id", "DESC")
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

  async update(dto: UpdateCComercialesDto, userLogin: UsuariosEntity) {
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

  async createImage(file: any, dto: CreateImageDto, userLogin: UsuariosEntity) {
    if ((parseInt(dto.isBack) == 0 || parseInt(dto.isBack) == 1) && dto.index === undefined) {
      try {
        const data = {
          entidad: 'ccomercial',
          entId: parseInt(dto.ccomercial),
          referencia: parseInt(dto.isBack) == 0 ? 'image' : 'imageBack',
          refId: parseInt(dto.ccomercial),
        }
        const res = await this.galeriaService.create(file, data, userLogin)

        if (parseInt(dto.isBack) == 0) {
          await this.ccomercialesRP.update(parseInt(dto.ccomercial), {
            image: res.id
          });
        } else {
          await this.ccomercialesRP.update(parseInt(dto.ccomercial), {
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
        entidad: 'ccomercial',
        entId: parseInt(dto.ccomercial),
        referencia: 'galeria',
        refId: parseInt(dto.ccomercial),
      }
      const res = await this.galeriaService.create(file, data, userLogin)

      const findOne = await this.ccomercialesGaleriaRP.findOne({
        where: {
          ccomercial: dto.ccomercial,
          index: dto.index,
        }
      })
      if (!isEmptyUndefined(findOne)) {
        await this.ccomercialesGaleriaRP.update(findOne.id, {
          galeria: res.id
        });
      } else {
        await this.ccomercialesGaleriaRP.save({
          ccomercial: parseInt(dto.ccomercial),
          index: parseInt(dto.index),
          galeria: res.id
        });
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
        ccomercial: dto.ccomercial,
        index: dto.index,
      }
    })
    if (!isEmptyUndefined(findOne)) {
      await this.ccomercialesGaleriaRP.update(findOne.id, {
        galeria: dto.galeria,
      });
    } else {
      await this.ccomercialesGaleriaRP.save({
        ccomercial: dto.ccomercial,
        index: dto.index,
        galeria: dto.galeria
      });
    }
    return await this.getOne(dto.ccomercial);
  }

  async getCines(id: Number, options: IPaginationOptions): Promise<Pagination<CinesCComercialesEntity>> {
    const query = await this.cinesCComercialesRP
      .createQueryBuilder("ciCC")
      .leftJoinAndSelect("ciCC.cine", "cine")
      .leftJoinAndSelect("ciCC.files", "ficiGal")
      .leftJoinAndSelect("ciCC.panoramas", "panGal")
      .leftJoinAndSelect("cine.image", "imgGal")
      .leftJoinAndSelect("cine.imageBack", "imgBackGal")
      .leftJoinAndSelect("ficiGal.galeria", "ciGal")
      .leftJoinAndSelect("panGal.image", "panImgGal")
      .select([
        'ciCC.id',
        'ciCC.ubicacion',
        'cine.id',
        'cine.nombre',
        'cine.desc',
        'cine.status',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'ficiGal.id',
        'ciGal.id',
        'ciGal.file',
        'panGal.id',
        'panGal.nombre',
        'panGal.desc',
        'panImgGal.id',
        'panImgGal.file',
      ])
      .loadRelationCountAndMap('ciCC.totalPeliculas', 'ciCC.peliculas')
      .where('ciCC.ccomercial = :id', { id })
      .orderBy("cine.nombre", "ASC")
    query.getMany();
    return paginate<CinesCComercialesEntity>(query, options);
  }

  async getTiendas(id: Number, idCategoria, options: IPaginationOptions): Promise<Pagination<TiendasCComercialesEntity>> {
    const query = await this.tiendasCComercialesRP
      .createQueryBuilder("tieCC")
      .leftJoinAndSelect("tieCC.categoria", "cat")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("tie.image", "imgGal")
      .leftJoinAndSelect("tie.imageBack", "imgBackGal")
      .leftJoinAndSelect("tieCC.files", "tieFiGal")
      .leftJoinAndSelect("tieFiGal.galeria", "tieGal")
      .leftJoinAndSelect("tieCC.panoramas", "panGal")
      .leftJoinAndSelect("panGal.image", "panImgGal")
      .select([
        'tieCC.id',
        'tieCC.correo',
        'tieCC.telefonos',
        'tieCC.ubicacion',
        'tieCC.abierto',
        'tieCC.status',
        'tie.id',
        'tie.nombre',
        'tie.desc',
        'tie.isGastro',
        'tie.status',
        'cat.id',
        'cat.nombre',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
        'tieFiGal.id',
        'tieGal.id',
        'tieGal.file',
        'panGal.id',
        'panGal.nombre',
        'panGal.desc',
        'panImgGal.id',
        'panImgGal.file',
      ])
      .where('tieCC.ccomercial = :id', { id })
    if (!isEmptyUndefined(idCategoria)) {
      query.andWhere('cat.id = :categoria', { categoria: idCategoria })
    }
    query.orderBy("tie.nombre", "ASC")
    query.getMany();
    return paginate<TiendasCComercialesEntity>(query, options);
  }

  async getGastro(id: Number, isGastro: Boolean, options: IPaginationOptions): Promise<Pagination<TiendasCComercialesEntity>> {
    const query = await this.tiendasCComercialesRP
      .createQueryBuilder("tieCC")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("tie.image", "imgGal")
      .leftJoinAndSelect("tie.imageBack", "imgBackGal")
      .select([
        'tieCC.id',
        'tieCC.correo',
        'tieCC.telefonos',
        'tieCC.ubicacion',
        'tieCC.abierto',
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
      .where('tieCC.ccomercial = :id', { id })
      .andWhere('tie.isGastro = :isGastro', { isGastro })
      .andWhere('tie.status = :status', { status: true })
      .orderBy("tie.nombre", "ASC")
    query.getMany();
    return paginate<TiendasCComercialesEntity>(query, options);
  }

  async getPanoramas(id: number, options: IPaginationOptions) {
    const data = {
      ccomercial: id,
      tienda: null,
      cine: null,
    }
    const getAll = await this.panoramasService.getAll(data, options);
    return getAll;
  }

}
