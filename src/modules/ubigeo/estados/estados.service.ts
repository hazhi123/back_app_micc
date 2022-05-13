import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../../common/constants';
import { isEmptyUndefined } from '../../../common/helpers';
import { UsersEntity } from '../../users/entities/users.entity';
import {
  CreateEstadosDto,
  GetAllDto,
  UpdateEstadosDto,
} from './dto';
import { EstadosEntity } from './entities/estados.entity';

@Injectable()
export class EstadosService {

  constructor(
    @InjectRepository(EstadosEntity)
    private readonly estadosRP: Repository<EstadosEntity>
  ) { }

  async create(dto: CreateEstadosDto, userLogin: UsersEntity) {
    await this.findNombre(dto.estado, false)
    const save = await this.estadosRP.save(
      dto,
    );
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto): Promise<EstadosEntity[]> {
    const query = await this.estadosRP
      .createQueryBuilder("edo")
      .leftJoinAndSelect("edo.pais", "pais")
      .select([
        'edo.id',
        'edo.estado',
      ])
    if (!isEmptyUndefined(dto.pais)) {
      query.andWhere('pais.id = :paisId', { paisId: dto.pais })
    }
    query.orderBy("edo.estado", "ASC")
    const getAll = query.getMany();
    if (isEmptyUndefined(getAll)) return null
    return getAll;
  }

  async getOne(id: number): Promise<EstadosEntity> {
    const find = await this.estadosRP
      .createQueryBuilder("edo")
      .leftJoinAndSelect("edo.pais", "pais")
      .select([
        'edo.id',
        'edo.estado',
        'pais.id',
        'pais.nombre',
        'pais.code',
      ])
      .where('ciu.id = :id', { id })
      .getOne();
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async update(dto: UpdateEstadosDto, userLogin: UsersEntity) {
    const findNombre = await this.findNombre(dto.estado, true)
    if (!isEmptyUndefined(findNombre)) delete dto.estado

    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    const assingUsers = Object.assign(getOne, {
      ...dto,
    })
    await this.estadosRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.estadosRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.estadosRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}