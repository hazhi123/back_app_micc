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
import { CreateContactosDto, GetAllxAtributoDto } from './dto';
import { ContactosService } from './contactos.service';
import { isEmptyUndefined } from '../../common/helpers';

@ApiTags(CONST.MODULES.CONTACTOS.toUpperCase())
@Controller(CONST.MODULES.CONTACTOS)
export class ContactosController {
  constructor(
    private readonly contactosService: ContactosService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateContactosDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.contactosService.create(dto, userLogin);
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
    const data = await this.contactosService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.CONTACTOS}`,
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
    const data = await this.contactosService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ) {
    const data = await this.contactosService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
