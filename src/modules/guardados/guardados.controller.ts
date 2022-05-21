import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { URLPAGE } from '../../config';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { CreateGuardadosDto } from './dto';
import { GuardadosService } from './guardados.service';

@ApiTags('Guardados')
@Controller('guardados')
export class GuardadosController {
  constructor(
    private readonly guardadosService: GuardadosService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateGuardadosDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.guardadosService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.guardadosService.getAll(userLogin.id, {
      page,
      limit,
      route: `${URLPAGE}/guardados`,
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

}
