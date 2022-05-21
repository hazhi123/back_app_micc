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

import * as CONST from '../../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../../common/decorators';
import { isEmptyUndefined } from '../../../common/helpers';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';
import {
  CreateParroquiasDto,
  GetAllDto,
  UpdateParroquiasDto,
} from './dto';
import { ParroquiasService } from './parroquias.service';

@ApiTags('Ubicacion geografica de Parroquias')
@Controller('ubigeo/parroquias')
export class ParroquiasController {
  constructor(
    private readonly estadosService: ParroquiasService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateParroquiasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.estadosService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Post('/all')
  async getAll(
    @Body() dto: GetAllDto,
  ) {
    const data = await this.estadosService.getAll(dto);
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
    const data = await this.estadosService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateParroquiasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.estadosService.update(dto, userLogin);
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
    const data = await this.estadosService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
