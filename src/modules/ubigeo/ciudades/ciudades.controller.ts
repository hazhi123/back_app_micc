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
import { CiudadesService } from './ciudades.service';
import {
  CreateCiudadesDto,
  GetAllDto,
  UpdateCiudadesDto,
} from './dto';

@ApiTags('Ubicacion geografica de Ciudades')
@Controller('ubigeo/ciudades')
export class CiudadesController {
  constructor(
    private readonly ciudadesService: CiudadesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateCiudadesDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.ciudadesService.create(dto, userLogin);
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
    const data = await this.ciudadesService.getAll(dto);
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
    const data = await this.ciudadesService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateCiudadesDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.ciudadesService.update(dto, userLogin);
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
    const data = await this.ciudadesService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
