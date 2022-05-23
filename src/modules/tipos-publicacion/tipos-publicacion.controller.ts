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
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  CreateTiposPublicacionDto,
  GetAllDto,
  UpdateTiposPublicacionDto,
} from './dto';
import { TiposPublicacionService } from './tipos-publicacion.service';

@ApiTags('Tipos de publicacion')
@Controller('publicaciones/tipos_publicacion')
export class TiposPublicacionController {
  constructor(
    private readonly tiposPublicacionService: TiposPublicacionService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateTiposPublicacionDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.tiposPublicacionService.create(dto, userLogin);
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
    const data = await this.tiposPublicacionService.getAll(dto);
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
    const data = await this.tiposPublicacionService.getOne(id);
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
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.tiposPublicacionService.update(dto, userLogin);
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
    const data = await this.tiposPublicacionService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
