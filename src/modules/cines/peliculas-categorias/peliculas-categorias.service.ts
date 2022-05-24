import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../../common/constants';
import { isEmptyUndefined } from '../../../common/helpers';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';
import {
  CreatePeliculasCategoriasDto,
  GetAllPeliculasCategoriasDto,
  UpdatePeliculasCategoriasDto,
} from './dto';
import {
  PeliculasCategoriasEntity,
} from './entities/peliculas-categorias.entity';

@Injectable()
export class PeliculasCategoriasService {

  constructor(
    @InjectRepository(PeliculasCategoriasEntity)
    private readonly peliculasCategoriasRP: Repository<PeliculasCategoriasEntity>,

  ) { }

  async create(dto: CreatePeliculasCategoriasDto, userLogin: UsuariosEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.peliculasCategoriasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllPeliculasCategoriasDto): Promise<PeliculasCategoriasEntity[]> {
    const query = await this.peliculasCategoriasRP
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

  async getOne(id: number): Promise<PeliculasCategoriasEntity> {
    return await this.peliculasCategoriasRP.findOne({
      where: { id },
    });
  }

  async update(dto: UpdatePeliculasCategoriasDto, userLogin: UsuariosEntity) {
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
    await this.peliculasCategoriasRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.peliculasCategoriasRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.peliculasCategoriasRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}
