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
  CreateHorariosDto,
} from './dto';
import { HorariosEntity } from './entities/horarios.entity';

@Injectable()
export class HorariosService {

  relations = [
    'ccomercial'
  ]

  constructor(
    @InjectRepository(HorariosEntity)
    private readonly horariosRP: Repository<HorariosEntity>
  ) { }

  async create(dto: CreateHorariosDto, userLogin: UsersEntity) {
    const getOne = await this.getOne(dto.ccomercial)

    if (isEmptyUndefined(getOne)) {
      const save = await this.horariosRP.save({
        ...dto,
        createdBy: userLogin.id,
        createdAt: new Date(),
        updatedBy: userLogin.id,
        updatedAt: new Date(),
      });
      return await this.getOne(save.ccomercial);
    } else {
      delete getOne.ccomercial
      await this.horariosRP.update(dto.ccomercial, dto);
      return await this.getOne(dto.ccomercial);
    }

  }

  async getAll(): Promise<HorariosEntity[]> {
    const find = await this.horariosRP.find({
      relations: this.relations,
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(ccomercial: number): Promise<HorariosEntity> {
    return await this.horariosRP.findOne({
      where: { ccomercial },
      relations: this.relations
    });
  }

}
