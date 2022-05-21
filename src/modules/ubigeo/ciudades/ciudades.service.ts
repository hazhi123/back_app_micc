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
  CreateCiudadesDto,
  GetAllDto,
  UpdateCiudadesDto,
} from './dto';
import { CiudadesEntity } from './entities/ciudades.entity';

@Injectable()
export class CiudadesService {

  constructor(
    @InjectRepository(CiudadesEntity)
    private readonly ciudadessRP: Repository<CiudadesEntity>
  ) { }

  async create(dto: CreateCiudadesDto, userLogin: UsuariosEntity) {
    await this.findNombre(dto.ciudad, false)
    const save = await this.ciudadessRP.save(dto);
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto): Promise<CiudadesEntity[]> {
    const query = await this.ciudadessRP
      .createQueryBuilder("ciu")
      .leftJoinAndSelect("ciu.estado", "edo")
      .select([
        'ciu.id',
        'ciu.ciudad',
        'ciu.capital',
      ])
    if (!isEmptyUndefined(dto.estado)) {
      query.andWhere('edo.id = :id', { id: dto.estado })
    }
    if (!isEmptyUndefined(dto.status)) {
      // query.andWhere('ciu.status = :status', { status: dto.status })
    }
    query.orderBy("ciu.ciudad", "ASC")
    const getAll = query.getMany();
    if (isEmptyUndefined(getAll)) return null
    return getAll;
  }

  async getOne(id: number): Promise<CiudadesEntity> {
    const find = await this.ciudadessRP
      .createQueryBuilder("ciu")
      .leftJoinAndSelect("ciu.estado", "edo")
      .where('ciu.id = :id', { id })
      .getOne();
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async update(dto: UpdateCiudadesDto, userLogin: UsuariosEntity) {
    const findNombre = await this.findNombre(dto.ciudad, true)
    if (!isEmptyUndefined(findNombre)) delete dto.ciudad

    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    const assingUsers = Object.assign(getOne, dto)
    await this.ciudadessRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.ciudadessRP.delete(id);
    return getOne;
  }

  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.ciudadessRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}
