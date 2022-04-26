import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  AddCComercialDto,
  CreateUsersCComercialesDto,
} from './dto';
import { UsersCComercialesEntity } from './entities/users-ccomerciales.entity';

@Injectable()
export class UsersCComercialesService {

  relations = [
    'ccomercial',
    'ccomercial.ciudad',
  ]

  constructor(
    @InjectRepository(UsersCComercialesEntity)
    private readonly usersCComercialesRP: Repository<UsersCComercialesEntity>,

  ) { }

  async create(dto: CreateUsersCComercialesDto, userLogin: UsersEntity) {

    await this.usersCComercialesRP
      .createQueryBuilder()
      .delete()
      .where("user = :id", { id: dto.user })
      .execute();

    for (let index = 0; index < dto.ccomerciales.length; index++) {
      const ccomercial = dto.ccomerciales[index];
      await this.usersCComercialesRP.save({
        user: dto.user,
        ccomercial,
        createdBy: userLogin.id,
        createdAt: new Date(),
        updatedBy: userLogin.id,
        updatedAt: new Date(),
      });
    }

    const find = await this.usersCComercialesRP.find({
      where: { user: dto.user },
      relations: this.relations,
    });

    if (isEmptyUndefined(find)) return null
    return find;
  }

  async addCComercial(dto: AddCComercialDto, userLogin: UsersEntity) {
    const { user, ccomercial } = dto

    const find = await this.usersCComercialesRP.findOne({
      where: { user, ccomercial }
    });

    if (!isEmptyUndefined(find)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Ya este registro existe',
    }, HttpStatus.ACCEPTED)

    const save = await this.usersCComercialesRP.save({
      user,
      ccomercial,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });

    const getOne = await this.usersCComercialesRP.findOne({
      where: { id: save.id },
      relations: this.relations,
    });
    return getOne;
  }

  async getUser(user: number): Promise<UsersCComercialesEntity> {
    return await this.usersCComercialesRP.findOne({
      where: { user },
      relations: this.relations
    });
  }

  async delCComercial(dto: AddCComercialDto) {
    const { user, ccomercial } = dto

    const getOne = await this.usersCComercialesRP.findOne({
      where: { user, ccomercial },
      relations: this.relations,
    });

    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Ya este registro no existe',
    }, HttpStatus.ACCEPTED)

    await this.usersCComercialesRP.delete(getOne.id);
    return getOne;
  }

}
