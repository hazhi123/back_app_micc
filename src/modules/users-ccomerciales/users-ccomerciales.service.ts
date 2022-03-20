import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import { CreateUsersCComercialesDto } from './dto';
import { UsersCComercialesEntity } from './entities/users-ccomerciales.entity';

@Injectable()
export class UsersCComercialesService {

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
      relations: [
        'ccomercial',
        'ccomercial.pais',
      ],
    });

    if (isEmptyUndefined(find)) return null
    return find;
  }

}
