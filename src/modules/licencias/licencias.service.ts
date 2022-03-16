import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateLicenciasDto,
  UpdateLicenciasDto,
} from './dto';
import { LicenciasEntity } from './entities/licencias.entity';

@Injectable()
export class LicenciasService {

  relations = ['user']

  constructor(
    @InjectRepository(LicenciasEntity)
    private readonly licenciasRP: Repository<LicenciasEntity>
  ) { }

  async create(dto: CreateLicenciasDto, userLogin: UsersEntity) {
    await this.findLicencia(dto.licencia);
    const save = await this.licenciasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });
    return await this.getOne(save.id);
  }

  async getAll(): Promise<LicenciasEntity[]> {
    const find = await this.licenciasRP.find({
      relations: this.relations
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<LicenciasEntity> {
    return await this.licenciasRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdateLicenciasDto, userLogin: UsersEntity) {
    if (isEmptyUndefined(userLogin)) throw new NotFoundException(CONST.MESSAGES.COMMON.ERROR.ROLES);
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    if (dto.userId !== getOne.user.id) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Esta licencia no esta registrada con el usuario correcto',
    }, HttpStatus.ACCEPTED)
    await this.findLicencia(dto.licencia)
    const assing = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    })
    await this.licenciasRP.update(getOne.id, assing)
    const res = await this.getOne(dto.id)
    return res
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.licenciasRP.delete(id);
    return getOne;
  }

  async findLicencia(license: string) {
    const findOne = await this.licenciasRP.findOne({ where: { license } })
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Esta licencia ya se encuentra registrada',
    }, HttpStatus.ACCEPTED)
  }

}
