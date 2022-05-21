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
  CreateModulosDto,
  UpdateModulosDto,
} from './dto';
import { ModulosService } from './modulos.service';

@ApiTags('Modulos del sistema')
@Controller('sistema/modulos')
export class ModulosController {
  constructor(
    private readonly ModulosService: ModulosService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateModulosDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.ModulosService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll() {
    const data = await this.ModulosService.getAll();
    let res = {
      statusCode: 200,
      data,
      message: ''
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.ModulosService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateModulosDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.ModulosService.update(dto, userLogin);
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
    const data = await this.ModulosService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
