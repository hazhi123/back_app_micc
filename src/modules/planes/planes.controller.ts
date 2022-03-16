import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
  CreatePlanesDto,
  UpdatePlanesDto,
} from './dto';
import { PlanesService } from './planes.service';

@ApiTags(CONST.MODULES.PLANES.toUpperCase())
@Controller(CONST.MODULES.PLANES)
export class PlanesController {
  constructor(
    private readonly plansService: PlanesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePlanesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.plansService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll() {
    const data = await this.plansService.getAll();
    let res = {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data.length) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.plansService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePlanesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.plansService.update(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ) {
    const data = await this.plansService.delete(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.ERROR.DELETE : CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
