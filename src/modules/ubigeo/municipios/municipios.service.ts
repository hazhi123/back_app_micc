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
  CreateMunicipiosDto,
  GetAllDto,
  UpdateMunicipiosDto,
} from './dto';
import { MunicipiosEntity } from './entities/municipios.entity';

@Injectable()
export class MunicipiosService {

  constructor(
    @InjectRepository(MunicipiosEntity)
    private readonly municipiosRP: Repository<MunicipiosEntity>
  ) { }

  async create(dto: CreateMunicipiosDto, userLogin: UsersEntity) {
    await this.findNombre(dto.municipio, false)
    const save = await this.municipiosRP.save(dto);
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto): Promise<MunicipiosEntity[]> {
    const query = await this.municipiosRP
      .createQueryBuilder("mun")
      .leftJoinAndSelect("mun.estado", "edo")
      .select([
        'mun.id',
        'mun.nombre',
        'mun.status',
      ])
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('edo.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.estado)) {
      query.andWhere('edo.id = :id', { id: dto.estado })
    }
    query.orderBy("edo.nombre", "ASC")
    const getAll = query.getMany();
    if (isEmptyUndefined(getAll)) return null
    return getAll;
  }

  async getOne(id: number): Promise<MunicipiosEntity> {
    const find = await this.municipiosRP
      .createQueryBuilder("mun")
      .leftJoinAndSelect("edo.estado", "edo")
      .select([
        'mun.id',
        'mun.municipio',
        'mun.createdBy',
        'mun.createdAt',
        'mun.updatedBy',
        'mun.updatedAt',
        'mun.status',
        'edo.id',
        'edo.nombre',
      ])
      .where('mun.id = :id', { id })
      .getOne();
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async update(dto: UpdateMunicipiosDto, userLogin: UsersEntity) {
    const findNombre = await this.findNombre(dto.municipio, true)
    if (!isEmptyUndefined(findNombre)) delete dto.municipio

    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    const assingUsers = Object.assign(getOne, dto)
    await this.municipiosRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.municipiosRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.municipiosRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}
