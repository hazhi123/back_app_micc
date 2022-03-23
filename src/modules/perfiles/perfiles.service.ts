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
  CreatePerfilesDto,
  GetAllxAtributoDto,
  UpdatePerfilesDto,
} from './dto';
import { PerfilesEntity } from './entities/perfiles.entity';

@Injectable()
export class PerfilesService {

  relations = []

  constructor(
    @InjectRepository(PerfilesEntity)
    private readonly perfilesRP: Repository<PerfilesEntity>
  ) { }

  async create(dto: CreatePerfilesDto, userLogin: UsersEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.perfilesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(): Promise<PerfilesEntity[]> {
    const find = await this.perfilesRP.find({
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<PerfilesEntity[]> {
    let search = {}
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    const find = await this.perfilesRP.find({
      where: search,
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<PerfilesEntity> {
    return await this.perfilesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdatePerfilesDto, userLogin: UsersEntity) {
    const findNombre = await this.findNombre(dto.nombre, true)
    if (!isEmptyUndefined(findNombre)) delete dto.nombre

    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    delete getOne.modulos
    const assingUsers = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: Date(),
    })
    await this.perfilesRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.perfilesRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.perfilesRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}
