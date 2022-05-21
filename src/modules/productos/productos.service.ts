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
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  CreateImageDto,
  CreateProductosDto,
  GetAllDto,
  UpdateImageDto,
  UpdateProductosDto,
} from './dto';
import { ProductosGaleriaEntity } from './entities/productos-galeria.entity';
import { ProductosEntity } from './entities/productos.entity';

@Injectable()
export class ProductosService {

  constructor(
    @InjectRepository(ProductosEntity)
    private readonly productosRP: Repository<ProductosEntity>,

    @InjectRepository(ProductosGaleriaEntity)
    private readonly productosGaleriaRP: Repository<ProductosGaleriaEntity>,

    private galeriaService: GaleriaService,

  ) { }

  async create(dto: CreateProductosDto, userLogin: UsuariosEntity) {
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
      .leftJoinAndSelect("pro.categoria", "cat")
      .leftJoinAndSelect("tie.image", "tieGal")
      .select([
        'pro.id',
        'pro.nombre',
        'pro.desc',
        'pro.etiqueta',
        'pro.status',
        'proGal.id',
        'proGal.file',
        'cat.id',
        'cat.nombre',
        'tie.id',
        'tie.nombre',
      ])

    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('pro.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.tienda) && dto.tienda !== 0) {
      query.andWhere('tie.id = :tienda', { tienda: dto.tienda })
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
      .leftJoinAndSelect("pro.categoria", "cat")
      .leftJoinAndSelect("tie.image", "tieGal")
      .leftJoinAndSelect("tie.ccomercial", "tiecc")
      .select([
        'pro.id',
        'pro.nombre',
        'pro.etiqueta',
        'pro.status',
        'proGal.id',
        'proGal.file',
        'cat.id',
        'cat.nombre',
        'tie.id',
        'tie.nombre',
      ])
    if (!isEmptyUndefined(dto.filtro)) {
      query.andWhere("LOWER(pro.nombre) like :filtro", { filtro: `%${dto.filtro.toLowerCase()}%` })
    }
    if (!isEmptyUndefined(dto.tienda) && dto.tienda !== 0) {
      query.andWhere('tie.id = :tienda', { tienda: dto.tienda })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('tiecc.id = :ccomercial', { ccomercial: dto.ccomercial })
    }
    query.andWhere('pro.status = :status', { status: true })
    query.getMany();
    return paginate<ProductosEntity>(query, options);
  }

  async getOne(id: number): Promise<ProductosEntity> {
    const getOne = await this.productosRP
      .createQueryBuilder("pro")
      .leftJoinAndSelect("pro.image", "proGal")
      .leftJoinAndSelect("pro.tienda", "tie")
      .leftJoinAndSelect("pro.categoria", "cat")
      .leftJoinAndSelect("pro.files", "file")
      .leftJoinAndSelect("file.galeria", "gal")
      .leftJoinAndSelect("tie.image", "tieGal")
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
        'proGal.id',
        'proGal.file',
        'tie.id',
        'tie.nombre',
        'tieGal.id',
        'tieGal.file',
        'cat.id',
        'cat.nombre',
        'file.id',
        'file.index',
        'gal.id',
        'gal.file',
      ])
      .where('pro.id = :id', { id })
      .getOne()

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdateProductosDto, userLogin: UsuariosEntity) {
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

  async createImage(file: any, dto: CreateImageDto, userLogin: UsuariosEntity) {
    if (dto.index === undefined || dto.index === '') {
      try {
        const data = {
          entidad: 'tienda',
          entId: parseInt(dto.entId),
          referencia: 'producto',
          refId: parseInt(dto.producto),
        }
        const res = await this.galeriaService.create(file, data, userLogin)
        await this.productosRP.update(parseInt(dto.producto), {
          image: res.id
        });
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
        entidad: 'tienda',
        entId: parseInt(dto.entId),
        referencia: 'producto',
        refId: parseInt(dto.producto),
      }
      const res = await this.galeriaService.create(file, data, userLogin)

      const findOne = await this.productosGaleriaRP.findOne({
        where: {
          producto: dto.producto,
          index: dto.index,
        }
      })
      if (!isEmptyUndefined(findOne)) {
        await this.productosGaleriaRP.update(findOne.id, {
          galeria: res.id
        });
      } else {
        await this.productosGaleriaRP.save({
          producto: parseInt(dto.producto),
          index: parseInt(dto.index),
          galeria: res.id
        });
      }
      return await this.getOne(parseInt(dto.producto));
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: 'Error al registrar la imagen',
      }, HttpStatus.ACCEPTED)
    }
  }

  async updateImage(dto: UpdateImageDto) {
    await this.productosRP.update(dto.producto, {
      image: dto.galeria
    });
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async deleteGaleria(dto: CreateImageDto) {
    await this.productosGaleriaRP.delete(parseInt(dto.file));
    return await this.getOne(parseInt(dto.producto));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const findOne = await this.productosGaleriaRP.findOne({
      where: {
        producto: dto.producto,
        index: dto.index,
      }
    })
    if (!isEmptyUndefined(findOne)) {
      await this.productosGaleriaRP.update(findOne.id, {
        galeria: dto.galeria,
      });
    } else {
      await this.productosGaleriaRP.save({
        producto: dto.producto,
        index: dto.index,
        galeria: dto.galeria
      });
    }
    return await this.getOne(dto.producto);
  }

}
