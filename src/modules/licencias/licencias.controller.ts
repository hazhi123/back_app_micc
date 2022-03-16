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
  CreateLicenciasDto,
  UpdateLicenciasDto,
} from './dto';
import { LicenciasService } from './licencias.service';

@ApiTags(CONST.MODULES.LICENCIAS.toUpperCase())
@Controller(CONST.MODULES.LICENCIAS)
export class LicenciasController {
  constructor(
    private readonly licenciasService: LicenciasService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateLicenciasDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.licenciasService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get('/all')
  async getAll() {
    const data = await this.licenciasService.getAll();
    let res = {
      statusCode: 200,
      data,
      entries: data.length,
      message: isEmptyUndefined(data.length) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : ''
    }
    if (data.length > 0) delete res.message
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.licenciasService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateLicenciasDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.licenciasService.update(dto, userLogin);
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
    const data = await this.licenciasService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
