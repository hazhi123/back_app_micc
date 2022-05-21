import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { isEmptyUndefined } from '../../common/helpers';
import { URLPAGE } from '../../config';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { ComentariosService } from './comentarios.service';
import {
  CreateComentariosDto,
  UpdateComentariosDto,
} from './dto';

@ApiTags('Comentarios')
@Controller('comentarios')
export class ComentariosController {
  constructor(
    private readonly comentariosService: ComentariosService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateComentariosDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.comentariosService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  // @Auth()
  @Get('publicacion/:id')
  async getAll(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
  ) {
    limit = limit > 100 ? 100 : limit;
    const data = await this.comentariosService.getAll(id, {
      page,
      limit,
      route: `${URLPAGE}/comentarios/publicacion/${id}`,
    });
    let res = {
      statusCode: 200,
      data: data.items,
      meta: data.meta,
      links: data.links,
      message: ''
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.comentariosService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateComentariosDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.comentariosService.update(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.comentariosService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
