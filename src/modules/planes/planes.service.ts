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
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
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

  async create(dto: CreatePlanesDto, userLogin: UsuariosEntity) {
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
    const query = await this.planesRP
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
    if (!isEmptyUndefined(dto.tipo)) {
      query.andWhere('plan.tipo = :tipo', { tipo: dto.tipo })
    }
    query.orderBy("plan.id", "DESC")
    query.getMany();
    return paginate<PlanesEntity>(query, options);
  }

  async getOne(id: number): Promise<PlanesEntity> {
    return await this.planesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdatePlanesDto, userLogin: UsuariosEntity) {
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
