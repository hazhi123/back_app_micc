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
import { CategoriasService } from './categorias.service';
import {
  CreateCategoriasDto,
  GetAllxAtributoDto,
  UpdateCategoriasDto,
} from './dto';

@ApiTags(CONST.MODULES.CATEGORIAS.toUpperCase())
@Controller(CONST.MODULES.CATEGORIAS)
export class CategoriasController {
  constructor(
    private readonly categoriaService: CategoriasService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateCategoriasDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.categoriaService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll() {
    const data = await this.categoriaService.getAll();
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
    const data = await this.categoriaService.getAllxAtributo(dto);
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
    const data = await this.categoriaService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateCategoriasDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.categoriaService.update(dto, userLogin);
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
    const data = await this.categoriaService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
