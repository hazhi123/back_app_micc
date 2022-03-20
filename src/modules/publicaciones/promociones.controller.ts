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
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreatePromocionesDto,
  UpdatePromocionesDto,
} from './dto';
import { PromocionesService } from './publicaciones.service';

@ApiTags(CONST.MODULES.PROMOCIONES.toUpperCase())
@Controller(CONST.MODULES.PROMOCIONES)
export class PromocionesController {
  constructor(
    private readonly promocionesService: PromocionesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePromocionesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.promocionesService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  // @Auth()
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.promocionesService.getAll({
      page,
      limit,
      route: 'http://micc.com/promociones',
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
    const data = await this.promocionesService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePromocionesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.promocionesService.update(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.promocionesService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
