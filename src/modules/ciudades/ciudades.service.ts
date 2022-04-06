import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateCiudadesDto,
  GetAllxAtributoDto,
  UpdateCiudadesDto,
} from './dto';
import { CiudadesEntity } from './entities/ciudades.entity';

@Injectable()
export class CiudadesService {

  relations = [
    'pais'
  ]

  constructor(
    @InjectRepository(CiudadesEntity)
    private readonly ciudadesRP: Repository<CiudadesEntity>
  ) { }

  async create(dto: CreateCiudadesDto, userLogin: UsersEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.ciudadesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(): Promise<CiudadesEntity[]> {
    const find = await this.ciudadesRP.find({
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }


  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<CiudadesEntity[]> {
    let search = {}
    if (!isEmptyUndefined(dto.pais)) search['pais'] = dto.pais
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    const find = await this.ciudadesRP.find({
      where: search,
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<CiudadesEntity> {
    return await this.ciudadesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdateCiudadesDto, userLogin: UsersEntity) {
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
    await this.ciudadesRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.ciudadesRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.ciudadesRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}
