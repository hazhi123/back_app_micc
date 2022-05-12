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
  CreateCinesDto,
  GetAllDto,
  UpdateCinesDto,
} from './dto';
import { CinesEntity } from './entities/cines.entity';

@Injectable()
export class CinesService {

  constructor(
    @InjectRepository(CinesEntity)
    private readonly cinesRP: Repository<CinesEntity>
  ) { }

  async create(dto: CreateCinesDto, userLogin: UsersEntity) {
    const save = await this.cinesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<CinesEntity>> {
    const query = await this.cinesRP
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
    return paginate<CinesEntity>(query, options);
  }

  async getOne(id: number): Promise<CinesEntity> {
    return await this.cinesRP.findOne({
      where: { id },
      relations: []
    });
  }

  async update(dto: UpdateCinesDto, userLogin: UsersEntity) {
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
    await this.cinesRP.update(getOne.id, data);
    return await this.getOne(dto.id);;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.cinesRP.delete(id);
    return getOne;
  }

}
