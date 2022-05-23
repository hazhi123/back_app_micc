import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  CreateProductosCategoriasDto,
  GetAllProductosCategoriasDto,
  UpdateProductosCategoriasDto,
} from './dto';
import {
  ProductosCategoriasEntity,
} from './entities/productos-categorias.entity';

@Injectable()
export class ProductosCategoriasService {

  constructor(
    @InjectRepository(ProductosCategoriasEntity)
    private readonly productosCategoriasRP: Repository<ProductosCategoriasEntity>,

  ) { }

  async create(dto: CreateProductosCategoriasDto, userLogin: UsuariosEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.productosCategoriasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllProductosCategoriasDto): Promise<ProductosCategoriasEntity[]> {
    const query = await this.productosCategoriasRP
      .createQueryBuilder("cat")
    query
      .select([
        'cat.id',
        'cat.nombre',
        'cat.desc',
        'cat.status',
      ])
      .orderBy("cat.id", "DESC")
    const find = query.getMany();
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<ProductosCategoriasEntity> {
    return await this.productosCategoriasRP.findOne({
      where: { id },
    });
  }

  async update(dto: UpdateProductosCategoriasDto, userLogin: UsuariosEntity) {
    const findNombre = await this.findNombre(dto.nombre, true)
    if (!isEmptyUndefined(findNombre)) delete dto.nombre

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
    await this.productosCategoriasRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.productosCategoriasRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.productosCategoriasRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}
