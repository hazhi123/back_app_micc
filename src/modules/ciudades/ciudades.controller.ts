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
import { CiudadesService } from './ciudades.service';
import {
  CreateCiudadesDto,
  GetAllxAtributoDto,
  UpdateCiudadesDto,
} from './dto';

@ApiTags(CONST.MODULES.CIUDADES.toUpperCase())
@Controller(CONST.MODULES.CIUDADES)
export class CiudadesController {
  constructor(
    private readonly ciudadesService: CiudadesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateCiudadesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.ciudadesService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll() {
    const data = await this.ciudadesService.getAll();
    let res = {
      statusCode: 200,
      data,
      message: ''
    }
    return res
  }

  @Post('/all')
  async getAllxAtributo(
    @Body() dto: GetAllxAtributoDto,
  ) {
    const data = await this.ciudadesService.getAllxAtributo(dto);
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
    const data = await this.ciudadesService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateCiudadesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.ciudadesService.update(dto, userLogin);
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
    const data = await this.ciudadesService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
