import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreatePublicacionesDto,
  GetAllxAtributoDto,
  UpdatePublicacionesDto,
} from './dto';
import { PublicacionesService } from './publicaciones.service';

@ApiTags(CONST.MODULES.PUBLICACIONES.toUpperCase())
@Controller(CONST.MODULES.PUBLICACIONES)
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePublicacionesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.publicacionesService.create(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.publicacionesService.getAll({
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.PUBLICACIONES}`,
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
  @Post('/all/atributo')
  async getAllxAtributo(
    @Body() dto: GetAllxAtributoDto,
  ) {
    const data = await this.publicacionesService.getAllxAtributo(dto);
    let res = {
      statusCode: HttpStatus.OK,
      data: data,
      message: ''
    }
    return res
  }

  @Auth()
  @Post('/all/publico')
  async getAllPublico(
    @Body() dto: GetAllxAtributoDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.publicacionesService.getAllPublico(dto, {
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.PUBLICACIONES}`,
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
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.publicacionesService.getOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePublicacionesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.publicacionesService.update(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.publicacionesService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
