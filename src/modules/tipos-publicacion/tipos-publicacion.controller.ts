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
  CreateTiposPublicacionDto,
  GetAllxAtributoDto,
  UpdateTiposPublicacionDto,
} from './dto';
import { TiposPublicacionService } from './tipos-publicacion.service';

@ApiTags(CONST.MODULES.TIPOS_PUBLICACION.toUpperCase())
@Controller(CONST.MODULES.TIPOS_PUBLICACION)
export class TiposPublicacionController {
  constructor(
    private readonly tiposPubService: TiposPublicacionService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateTiposPublicacionDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.tiposPubService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll() {
    const data = await this.tiposPubService.getAll();
    let res = {
      statusCode: 200,
      data,
      message: ''
    }
    return res
  }

  @Auth()
  @Post('/all/atributo')
  async getAllxAtributo(
    @Body() dto: GetAllxAtributoDto,
  ) {
    const data = await this.tiposPubService.getAllxAtributo(dto);
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
    const data = await this.tiposPubService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateTiposPublicacionDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.tiposPubService.update(dto, userLogin);
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
    const data = await this.tiposPubService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
