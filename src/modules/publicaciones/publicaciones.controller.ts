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

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { isEmptyUndefined } from '../../common/helpers';
import { URLPAGE } from '../../config';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateImageDto,
  CreatePublicacionesDto,
  GetAllDto,
  UpdateImageDto,
  UpdatePublicacionesDto,
} from './dto';
import { PublicacionesService } from './publicaciones.service';

@ApiTags(CONST.MODULES.PUBLICACIONES.toUpperCase())
@Controller(CONST.MODULES.PUBLICACIONES)
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePublicacionesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.publicacionesService.create(dto, userLogin);
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
    const data = await this.publicacionesService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.PUBLICACIONES}/all`,
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
  @Get('/all/publico')
  async getAllPublico(
    // @Body() dto: GetAllDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
    @Query('cc') cc: number,
    @Query('tie') tie: number,
    @Query('cat') cat: number,
    @Query('tipo') tipo: number
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.publicacionesService.getAllPublico(cc, tie, cat, tipo, {
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.PUBLICACIONES}/all/publico?cc=${cc}&tie=${tie}&cat=${cat}&tipo=${tipo}`,
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
  async getOne(
    @Param('id') id: number
  ) {
    const data = await this.publicacionesService.getOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePublicacionesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.publicacionesService.update(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.publicacionesService.delete(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
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
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.publicacionesService.createImage(file, dto, userLogin);
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
    const data = await this.publicacionesService.updateImage(dto);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/galeria')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async createGaleria(
    @UploadedFile() file,
    @Body() dto: CreateImageDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.publicacionesService.createImage(file, dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/galeria/delete')
  async createGaleriaDel(
    @Body() dto: CreateImageDto,
  ) {
    const data = await this.publicacionesService.deleteGaleria(dto);
    return {
      statusCode: 200,
      data,
      message: 'Se ha eliminado la imagen correctamente'
    };
  }

  @Auth()
  @Post('/galeria/update')
  async createGaleriaUpdate(
    @Body() dto: UpdateImageDto,
  ) {
    const data = await this.publicacionesService.updateGaleria(dto);
    return {
      statusCode: 200,
      data,
      message: 'La imagén se ha actualizado correctamente'
    };
  }

}
