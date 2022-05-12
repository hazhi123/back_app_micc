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

import * as CONST from '../../../common/constants';
import { isEmptyUndefined } from '../../../common/helpers';
import { UsersEntity } from '../../users/entities/users.entity';
import {
  CreatePeliculasDto,
  GetAllDto,
  UpdatePeliculasDto,
} from './dto';
import { PeliculasEntity } from './entities/peliculas.entity';

@Injectable()
export class PeliculasService {

  relations = []

  constructor(
    @InjectRepository(PeliculasEntity)
    private readonly peliculasRP: Repository<PeliculasEntity>
  ) { }

  async create(dto: CreatePeliculasDto, userLogin: UsersEntity) {
    const save = await this.peliculasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PeliculasEntity>> {
    const query = await this.peliculasRP
      .createQueryBuilder("plan")
      .select([
        'plan.id',
        'plan.tipo',
        'plan.nombre',
        'plan.costo',
        'plan.desc',
      ])
      .loadRelationCountAndMap('plan.totalLicencias', 'plan.licencias')

    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('plan.status = :status', { status: dto.status })
    }
    query.orderBy("plan.id", "DESC")
    query.getMany();
    return paginate<PeliculasEntity>(query, options);
  }

  async getOne(id: number): Promise<PeliculasEntity> {
    return await this.peliculasRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdatePeliculasDto, userLogin: UsersEntity) {
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
    await this.peliculasRP.update(getOne.id, data);
    return await this.getOne(dto.id);;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.peliculasRP.delete(id);
    return getOne;
  }

}
