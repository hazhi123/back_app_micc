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
  GetAllDto,
  UpdateCiudadesDto,
} from './dto';
import { CiudadesEntity } from './entities/ciudades.entity';

@Injectable()
export class CiudadesService {

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

  async getAll(dto: GetAllDto): Promise<CiudadesEntity[]> {
    const query = await this.ciudadesRP
      .createQueryBuilder("ciu")
      .leftJoinAndSelect("ciu.pais", "pais")
      .select([
        'ciu.id',
        'ciu.nombre',
        'ciu.status',
        'pais.nombre',
      ])
      .orderBy("ciu.nombre", "ASC")
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('ciu.status = :valor', { valor: dto.status })
    }
    if (!isEmptyUndefined(dto.pais)) {
      query.andWhere('pais.id = :paisId', { paisId: dto.pais })
    }
    const getAll = query.getMany();
    if (isEmptyUndefined(getAll)) return null
    return getAll;
  }

  async getOne(id: number): Promise<CiudadesEntity> {
    const find = await this.ciudadesRP
      .createQueryBuilder("ciu")
      .leftJoinAndSelect("ciu.pais", "pais")
      .select([
        'ciu.id',
        'ciu.nombre',
        'ciu.createdBy',
        'ciu.createdAt',
        'ciu.updatedBy',
        'ciu.updatedAt',
        'ciu.status',
        'ciu.id',
        'pais.id',
        'pais.nombre',
        'pais.code',
      ])
      .where('ciu.id = :id', { id })
      .getOne();
    if (isEmptyUndefined(find)) return null
    return find;
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
