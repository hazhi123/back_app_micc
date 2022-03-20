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
  CreatePaisesDto,
  GetAllxAtributoDto,
  UpdatePaisesDto,
} from './dto';
import { PaisesService } from './paises.service';

@ApiTags(CONST.MODULES.PAISES.toUpperCase())
@Controller(CONST.MODULES.PAISES)
export class PaisesController {
  constructor(
    private readonly paisesService: PaisesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePaisesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.paisesService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll() {
    const data = await this.paisesService.getAll(null);
    let res = {
      statusCode: 200,
      data,
      message: ''
    }
    return res
  }

  @Post('/all/atributo')
  async getAllxAtributo(
    @Body() dto: GetAllxAtributoDto,
  ) {
    const data = await this.paisesService.getAllxAtributo(dto);
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
    const data = await this.paisesService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePaisesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.paisesService.update(dto, userLogin);
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
    const data = await this.paisesService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
