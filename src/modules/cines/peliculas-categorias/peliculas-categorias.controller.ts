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
  CreatePeliculasCategoriasDto,
  GetAllPeliculasCategoriasDto,
  UpdatePeliculasCategoriasDto,
} from './dto';
import { PeliculasCategoriasService } from './peliculas-categorias.service';

@ApiTags('Categorias de peliculas')
@Controller('cines/peliculas/categorias')
export class PeliculasCategoriasController {
  constructor(
    private readonly categoriaService: PeliculasCategoriasService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePeliculasCategoriasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.categoriaService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/all')
  async getAll(
    @Body() dto: GetAllPeliculasCategoriasDto,
  ) {
    const data = await this.categoriaService.getAll(dto);
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
    const data = await this.categoriaService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePeliculasCategoriasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.categoriaService.update(dto, userLogin);
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
    const data = await this.categoriaService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
