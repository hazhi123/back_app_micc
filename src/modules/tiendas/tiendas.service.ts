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
  CComercialesEntity,
} from '../ccomerciales/entities/ccomerciales.entity';
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { GaleriaService } from '../galeria/galeria.service';
import { LicenciasEntity } from '../licencias/entities/licencias.entity';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateImageDto,
  CreateTiendasDto,
  GetAllDto,
  UpdateImageDto,
  UpdateTiendasDto,
} from './dto';
import { TiendasEntity } from './entities/tiendas.entity';

@Injectable()
export class TiendasService {

  constructor(
    @InjectRepository(TiendasEntity)
    private readonly tiendasRP: Repository<TiendasEntity>,

    @InjectRepository(CComercialesEntity)
    private readonly ccomercialesRP: Repository<CComercialesEntity>,

    @InjectRepository(LicenciasEntity)
    private readonly licenciasRP: Repository<LicenciasEntity>,

    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreateTiendasDto, userLogin: UsersEntity) {
    let galeria = []
    for (let x = 0; x < 9; x++) {
      galeria.push("0")
    }

    const save = await this.tiendasRP.save({
      ...dto,
      galeria,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });

    const ccomercial = await this.ccomercialesRP.findOne({
      where: { id: dto.ccomercial }
    })

    await this.ccomercialesRP.update(dto.ccomercial, {
      totalTiendas: ccomercial.totalTiendas + 1
    });

    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<TiendasEntity>> {
    const query = await this.tiendasRP
      .createQueryBuilder("ti")
    query
      .leftJoinAndSelect("ti.ccomercial", "cc")
      .leftJoinAndSelect("ti.categoria", "cat")
      .leftJoinAndSelect("ti.image", "gal")
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
        'gal.id',
        'gal.file',
      ])

    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccId', { ccId: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :catId', { catId: dto.categoria })
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
      .leftJoinAndSelect("ti.image", "gal")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.ubicacion',
        'ti.isGastro',
        'ti.abierto',
        'cat.id',
        'cat.nombre',
        'gal.id',
        'gal.file',
      ])
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccId', { ccId: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :catId', { catId: dto.categoria })
    }
    if (!isEmptyUndefined(dto.isGastro)) {
      query.andWhere('ti.isGastro = :isGastro', { isGastro: dto.isGastro })
    }
    query.andWhere('ti.status = :status', { status: true })
    query.addOrderBy("ti.nombre", "ASC")

    query.getMany();
    return paginate<TiendasEntity>(query, options);
  }

  async getOne(id: number, isGaleria: boolean = true): Promise<TiendasEntity> {
    const getOne = await this.tiendasRP
      .createQueryBuilder("ti")
      .leftJoinAndSelect("ti.horarios", "hor")
      .leftJoinAndSelect("ti.categoria", "cat")
      .leftJoinAndSelect("ti.image", "gal")
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
        'ti.galeria',
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
        'gal.id',
        'gal.file',
      ])
      .where('ti.id = :id', { id })
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

    const ccomercial = await this.ccomercialesRP.findOne({
      where: { id: getOne.ccomercial.id }
    })
    await this.ccomercialesRP.update(getOne.ccomercial.id, {
      totalTiendas: ccomercial.totalTiendas - 1
    });
    await this.tiendasRP.delete(id);

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
    const dato = await this.getOne(parseInt(dto.tienda), false);
    let galeria = dato.galeria

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

    for (let x = 0; x < 9; x++) {
      if (x == parseInt(dto.index)) {
        galeria[x] = galeriaId
      }
      if (isEmptyUndefined(galeria[x])) {
        galeria[x] = '0'
      }
    }
    await this.tiendasRP.update(parseInt(dto.tienda), {
      galeria
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
    const data = await this.getOne(parseInt(dto.tienda), false);
    data.galeria[parseInt(dto.index)] = '0'
    await this.tiendasRP.update(dto.tienda, {
      galeria: data.galeria
    });
    return await this.getOne(parseInt(dto.tienda));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const data = await this.getOne(dto.tienda, false);
    data.galeria[dto.index] = dto.galeria
    await this.tiendasRP.update(dto.tienda, {
      galeria: data.galeria
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
