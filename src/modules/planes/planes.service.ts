import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
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
  CreatePlanesDto,
  GetAllDto,
  UpdatePlanesDto,
} from './dto';
import { PlanesEntity } from './entities/planes.entity';

@Injectable()
export class PlanesService {

  relations = []

  constructor(
    @InjectRepository(PlanesEntity)
    private readonly planesRP: Repository<PlanesEntity>
  ) { }

  async create(dto: CreatePlanesDto, userLogin: UsersEntity) {
    const save = await this.planesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PlanesEntity>> {
    return paginate<PlanesEntity>(this.planesRP, options, {
      order: { 'id': 'DESC' },
    });
  }

  async getOne(id: number): Promise<PlanesEntity> {
    return await this.planesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdatePlanesDto, userLogin: UsersEntity) {
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    const data = {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    };
    await this.planesRP.update(getOne.id, data);
    return await this.getOne(dto.id);;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.planesRP.delete(id);
    return getOne;
  }

}
