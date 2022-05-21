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
import { CinesService } from './cines.service';
import {
  AsignarCComercialesDto,
  CreateCinesDto,
  CreateImageDto,
  GetAllDto,
  UpdateCinesDto,
  UpdateImageDto,
} from './dto';

const CINES = 'cines'

@ApiTags('Cines del Centro Comercial')
@Controller(CINES)
export class CinesController {
  constructor(
    private readonly cinesService: CinesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateCinesDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.cinesService.create(dto, userLogin);
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
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
    @Body() dto: GetAllDto,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.cinesService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${CINES}/all`,
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
    const data = await this.cinesService.getAllPublico(dto, {
      page,
      limit,
      route: `${URLPAGE}/${CINES}/publico`,
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
    const data = await this.cinesService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateCinesDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.cinesService.update(dto, userLogin);
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
    const data = await this.cinesService.delete(id);
    return {
      statusCode: 200,
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
    const data = await this.cinesService.createImage(file, dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/image/update')
  async createImageUpdate(
    @Body() dto: UpdateImageDto,
  ) {
    const data = await this.cinesService.updateImage(dto);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/asignar/ccomerciales')
  async asignarCComerciales(
    @Body() dto: AsignarCComercialesDto,
  ) {
    let data = await this.cinesService.asignarCComerciales(dto);
    return {
      statusCode: HttpStatus.OK,
      data: data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get(':id/ccomerciales')
  async getCComerciales(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.cinesService.getCComerciales(id, {
      page,
      limit,
      route: `${URLPAGE}/${CINES}/${id}/ccomerciales`,
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
  @Get(':id/peliculas')
  async getPeliculas(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.cinesService.getPeliculas(id, {
      page,
      limit,
      route: `${URLPAGE}/${CINES}/${id}/peliculas`,
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
