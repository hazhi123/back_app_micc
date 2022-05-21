import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { URLPAGE } from '../../config';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  CreateGaleriaDto,
  GetAllDto,
} from './dto';
import { GaleriaService } from './galeria.service';

@ApiTags('Galeria de imagenes y videos')
@Controller('galeria')
export class GaleriaController {
  constructor(
    private readonly galeriaService: GaleriaService
  ) { }

  @Auth()
  @Post()
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async create(
    @UploadedFile() file,
    @Body() dto: CreateGaleriaDto,
    @UserLogin() userLogin: UsuariosEntity,
  ) {
    let data = await this.galeriaService.create(file, dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/all')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number = 100,
    @Body() dto: GetAllDto,
  ) {
    limit = limit > 100 ? 100 : limit;
    const data = await this.galeriaService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/galeria/all`,
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
  async delete(@Param('id') id: number) {
    const data = await this.galeriaService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

}
