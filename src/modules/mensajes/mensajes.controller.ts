import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { URLPAGE } from '../../config';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { UsersEntity } from '../users/entities/users.entity';
import { CreateMensajesDto, GetAllxAtributoDto } from './dto';
import { MensajesService } from './mensajes.service';

@ApiTags(CONST.MODULES.MENSAJES.toUpperCase())
@Controller(CONST.MODULES.MENSAJES)
export class MensajesController {
  constructor(
    private readonly mensajesService: MensajesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateMensajesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.mensajesService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/all')
  async getAllxAtributo(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 100,
    @Body() dto: GetAllxAtributoDto,
  ) {
    limit = limit > 100 ? 100 : limit;
    const data = await this.mensajesService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.MENSAJES}`,
    });
    let res = {
      statusCode: HttpStatus.OK,
      data: data.items,
      meta: data.meta,
      links: data.links,
      message: ''
    }
    return res
  }

  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ) {
    const data = await this.mensajesService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
