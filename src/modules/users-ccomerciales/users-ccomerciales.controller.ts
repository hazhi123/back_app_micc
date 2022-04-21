import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  AddCComercialDto,
  CreateUsersCComercialesDto,
} from './dto';
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
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get('/user/:id')
  async getUser(
    @Param('id') id: number,
  ) {
    const data = await this.usersCComercialesService.getUser(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Post('/agregar')
  async addCComercial(
    @Body() dto: AddCComercialDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data;
    if (dto.tipo == 0) {
      data = await this.usersCComercialesService.delCComercial(dto);
    } else {
      if (dto.tipo == 1) {
        data = await this.usersCComercialesService.addCComercial(dto, userLogin);
      } else {
        throw new HttpException({
          statusCode: HttpStatus.ACCEPTED,
          message: 'Esta agregando un tipo incorrecto',
        }, HttpStatus.ACCEPTED)
      }
    }

    return {
      statusCode: HttpStatus.OK,
      data,
      message: 'Proceso exitoso'
    };
  }
}
