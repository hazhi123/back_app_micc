import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../../common/decorators';
import { isEmptyUndefined } from '../../../common/helpers';
import { URLPAGE } from '../../../config';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';
import {
  AsignarCinesDto,
  CreateImageDto,
  CreatePeliculasDto,
  GetAllDto,
  UpdateImageDto,
  UpdatePeliculasDto,
} from './dto';
import { PeliculasService } from './peliculas.service';

const PELICULAS = 'cines/peliculas'
@ApiTags('Peliculas')
@Controller(PELICULAS)
export class PeliculasController {
  constructor(
    private readonly peliculasService: PeliculasService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePeliculasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.peliculasService.create(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/all')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
    @Body() dto: GetAllDto,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.peliculasService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${PELICULAS}/all`,
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
  @Post('/publico')
  async getAllPublico(
    @Body() dto: GetAllDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.peliculasService.getAllPublico(dto, {
      page,
      limit,
      route: `${URLPAGE}/cines/peliculas/publico`,
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
    const data = await this.peliculasService.getOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePeliculasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.peliculasService.update(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ) {
    const data = await this.peliculasService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.ERROR.DELETE : CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

  @Auth()
  @Post('/image')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async createImage(
    @UploadedFile() file,
    @Body() dto: CreateImageDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.peliculasService.createImage(file, dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/image/update')
  async createImageUpdate(
    @Body() dto: UpdateImageDto,
  ) {
    const data = await this.peliculasService.updateImage(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/asignar/cines')
  async asignarCComerciales(
    @Body() dto: AsignarCinesDto,
  ) {
    let data = await this.peliculasService.asignarCines(dto);
    return {
      statusCode: HttpStatus.OK,
      data: data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }


  @Auth()
  @Get(':id/cines')
  async getCines(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.peliculasService.getCines(id, {
      page,
      limit,
      route: `${URLPAGE}/${PELICULAS}/${id}/cines`,
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
