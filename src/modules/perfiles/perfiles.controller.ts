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
  CreatePerfilesDto,
  GetAllDto,
  UpdatePerfilesDto,
} from './dto';
import { PerfilesService } from './perfiles.service';

@ApiTags(CONST.MODULES.USERS.PERFILES.toUpperCase())
@Controller(CONST.MODULES.USERS.PERFILES)
export class PerfilesController {
  constructor(
    private readonly perfilesService: PerfilesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePerfilesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.perfilesService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/all')
  async getAll(
    @Body() dto: GetAllDto,
  ) {
    const data = await this.perfilesService.getAll(dto);
    let res = {
      statusCode: 200,
      data: data,
      message: ''
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.perfilesService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePerfilesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.perfilesService.update(dto, userLogin);
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
    const data = await this.perfilesService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
