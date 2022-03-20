import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { UsersEntity } from '../users/entities/users.entity';
import { CreateUsersCComercialesDto } from './dto';
import { UsersCComercialesService } from './users-ccomerciales.service';

@ApiTags(CONST.MODULES.USERS.USERS_CCOMERCIALES.toUpperCase())
@Controller(CONST.MODULES.USERS.USERS_CCOMERCIALES)
export class UsersCComercialesController {
  constructor(
    private readonly usersCComercialesService: UsersCComercialesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateUsersCComercialesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.usersCComercialesService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

}
