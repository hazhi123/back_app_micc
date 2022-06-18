import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  CreateImageDto,
  CreatePanoramasDto,
  CreateParametrosDto,
  UpdateImageDto,
  UpdatePanoramasDto,
} from './dto';
import { PanoramasService } from './panoramas.service';

@ApiTags('Panoramas')
@Controller('panoramas')
export class PanoramasController {
  constructor(
    private readonly panoramasService: PanoramasService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePanoramasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.panoramasService.create(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number) {
    const data = await this.panoramasService.getOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdatePanoramasDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.panoramasService.update(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
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
  ): Promise<{ statusCode: any; data: any; message: string; }> {
    const data = await this.panoramasService.createImage(file, dto, userLogin);
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
    const data = await this.panoramasService.updateImage(dto);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/parametros')
  async parametros(
    @Body() dto: CreateParametrosDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    let data = await this.panoramasService.parametros(dto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

}
