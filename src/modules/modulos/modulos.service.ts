import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import {
  PerfilesModulosEntity,
} from '../perfiles-modulos/entities/perfiles-modulos.entity';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateModulosDto,
  UpdateModulosDto,
} from './dto';
import { ModulosEntity } from './entities/modulos.entity';

@Injectable()
export class ModulosService {

  relations = [
  ]

  constructor(
    @InjectRepository(ModulosEntity)
    private readonly modulosRP: Repository<ModulosEntity>,

    @InjectRepository(PerfilesModulosEntity)
    private readonly profilesModulosRP: Repository<PerfilesModulosEntity>
  ) { }

  async create(dto: CreateModulosDto, userLogin: UsersEntity) {
    await this.findName(dto.nombre, false);
    const save = await this.modulosRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(): Promise<ModulosEntity[]> {
    const find = await this.modulosRP.find({
      relations: this.relations,
      order: { 'id': 'DESC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<ModulosEntity> {
    return await this.modulosRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdateModulosDto, userLogin: UsersEntity) {
    let findName = await this.findName(dto.nombre, true);
    if (!isEmptyUndefined(findName)) delete dto.nombre

    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    const assingUsers = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    })
    await this.modulosRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    const find = await this.profilesModulosRP.find({
      where: { modulo: id }
    })
    if (find.length > 0) {
      throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: 'No puedes eliminar este registro, porque se encuentra asignado a otro dato',
      }, HttpStatus.ACCEPTED)
    }

    await this.modulosRP.delete(id);
    return getOne;
  }

  async findName(name: string, data: boolean) {
    const findOne = await this.modulosRP.findOne({ where: { name } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}
