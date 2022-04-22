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
  CreateProductosDto,
  GetAllDto,
  UpdateImageDto,
  UpdateProductosDto,
} from './dto';
import { ProductosEntity } from './entities/productos.entity';

@Injectable()
export class ProductosService {

  constructor(
    @InjectRepository(ProductosEntity)
    private readonly productosRP: Repository<ProductosEntity>,

    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreateProductosDto, userLogin: UsersEntity) {
    const save = await this.productosRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<ProductosEntity>> {
    const query = await this.productosRP
      .createQueryBuilder("pro")
    query
      .leftJoinAndSelect("pro.image", "proGal")
      .leftJoinAndSelect("pro.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieGal")
      .select([
        'pro.id',
        'pro.nombre',
        'pro.status',
        'proGal.id',
        'proGal.file',
      ])

    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('pro.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.tienda) && dto.tienda !== 0) {
      query.andWhere('tie.id = :tieId', { tieId: dto.tienda })
    }
    query.orderBy("pro.id", "DESC")
    query.getMany();
    return paginate<ProductosEntity>(query, options);
  }

  async getAllPublico(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<ProductosEntity>> {
    const query = await this.productosRP
      .createQueryBuilder("pro")
    query
      .leftJoinAndSelect("pro.image", "proGal")
      .leftJoinAndSelect("pro.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieGal")
      .leftJoinAndSelect("tie.ccomercial", "tiecc")
      .select([
        'pro.id',
        'pro.nombre',
        'pro.etiqueta',
        'pro.status',
        'proGal.id',
        'proGal.file',
      ])
    if (!isEmptyUndefined(dto.filtro)) {
      query.andWhere("LOWER(pro.nombre) like :filtro", { filtro: `%${dto.filtro.toLowerCase()}%` })
    }
    if (!isEmptyUndefined(dto.tienda) && dto.tienda !== 0) {
      query.andWhere('tie.id = :tieId', { tieId: dto.tienda })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('tiecc.id = :tieccId', { tieccId: dto.ccomercial })
    }
    query.andWhere('pro.status = :status', { status: true })
    query.getMany();
    return paginate<ProductosEntity>(query, options);
  }

  async getOne(id: number, isGaleria: boolean = true): Promise<ProductosEntity> {
    const getOne = await this.productosRP
      .createQueryBuilder("pro")
      .leftJoinAndSelect("pro.image", "proGal")
      .leftJoinAndSelect("pro.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieGal")
      .leftJoinAndSelect("tie.categoria", "cat")
      .select([
        'pro.id',
        'pro.nombre',
        'pro.desc',
        'pro.etiqueta',
        'pro.createdBy',
        'pro.createdAt',
        'pro.updatedBy',
        'pro.updatedAt',
        'pro.status',
        'pro.galeria',
        'proGal.id',
        'proGal.file',
        'tie.id',
        'tie.nombre',
        'tieGal.id',
        'tieGal.file',
        'cat.id',
        'cat.nombre',
      ])
      .where('pro.id = :id', { id })
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

  async update(dto: UpdateProductosDto, userLogin: UsersEntity) {
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
    const save = await this.productosRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.productosRP.delete(id);
    return getOne;
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {
    const dato = await this.getOne(parseInt(dto.producto), false);
    let galeria = dato.galeria

    if (isEmptyUndefined(dto.index)) {
      let galeriaId;
      let res: GaleriaEntity
      try {
        const data = {
          entidad: 'tienda',
          entId: parseInt(dto.entId),
          referencia: 'producto',
          refId: parseInt(dto.producto),
        }
        res = await this.galeriaService.create(file, data, userLogin)
        galeriaId = res.id
      } catch (error) {
        galeriaId = null
        res = null
      }

      await this.productosRP.update(parseInt(dto.producto), {
        image: galeriaId
      });
      return res;
    }

    let galeriaId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: 'tienda',
        entId: parseInt(dto.entId),
        referencia: 'producto',
        refId: parseInt(dto.producto),
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
    await this.productosRP.update(parseInt(dto.producto), {
      galeria
    });
    return await this.getOne(parseInt(dto.producto));
  }

  async updateImage(dto: UpdateImageDto) {
    await this.productosRP.update(dto.producto, {
      image: dto.galeria
    });
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async deleteGaleria(dto: CreateImageDto) {
    const data = await this.getOne(parseInt(dto.producto), false);
    data.galeria[parseInt(dto.index)] = '0'
    await this.productosRP.update(parseInt(dto.producto), {
      galeria: data.galeria
    });
    return await this.getOne(parseInt(dto.producto));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const data = await this.getOne(dto.producto, false);
    data.galeria[dto.index] = dto.galeria
    await this.productosRP.update(dto.producto, {
      galeria: data.galeria
    });
    return await this.getOne(dto.producto);
  }

}
