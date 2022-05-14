import {
  Body,
  Controller,
  Get,
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
import { CreateHorariosDto } from './dto';
import { HorariosService } from './horarios.service';

@ApiTags(CONST.MODULES.CCOMERCIALES.HORARIOS)
@Controller(CONST.MODULES.CCOMERCIALES.HORARIOS)
export class HorariosController {
  constructor(
    private readonly horariosService: HorariosService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateHorariosDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.horariosService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll() {
    const data = await this.horariosService.getAll();
    let res = {
      statusCode: 200,
      data,
      message: ''
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.horariosService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

}
