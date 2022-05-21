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
  CreateParroquiasDto,
  GetAllDto,
  UpdateParroquiasDto,
} from './dto';
import { ParroquiasEntity } from './entities/parroquias.entity';

@Injectable()
export class ParroquiasService {

  constructor(
    @InjectRepository(ParroquiasEntity)
    private readonly municipiosRP: Repository<ParroquiasEntity>
  ) { }

  async create(dto: CreateParroquiasDto, userLogin: UsuariosEntity) {
    await this.findNombre(dto.parroquia, false)
    const save = await this.municipiosRP.save(dto);
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto): Promise<ParroquiasEntity[]> {
    const query = await this.municipiosRP
      .createQueryBuilder("parr")
      .leftJoinAndSelect("parr.municipio", "mcpio")
      .select([
        'parr.id',
        'parr.parroquia',
        'parr.status',
      ])
      .orderBy("edo.nombre", "ASC")
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('edo.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.municipio)) {
      query.andWhere('mcpio.id = :id', { id: dto.municipio })
    }
    const getAll = query.getMany();
    if (isEmptyUndefined(getAll)) return null
    return getAll;
  }

  async getOne(id: number): Promise<ParroquiasEntity> {
    const find = await this.municipiosRP
      .createQueryBuilder("parr")
      .leftJoinAndSelect("parr.munipicio", "mcpio")
      .select([
        'parr.id',
        'parr.parroquia',
        'parr.status',
        'mcpio.id',
        'mcpio.municipio'
      ])
      .where('parr.id = :id', { id })
      .getOne();
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async update(dto: UpdateParroquiasDto, userLogin: UsuariosEntity) {
    const findNombre = await this.findNombre(dto.parroquia, true)
    if (!isEmptyUndefined(findNombre)) delete dto.parroquia

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
