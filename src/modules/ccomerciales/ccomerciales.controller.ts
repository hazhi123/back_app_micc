import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
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
import { CComercialesService } from './ccomerciales.service';
import {
  CreateCComercialesDto,
  CreateImageDto,
  GetAllxAtributoDto,
  UpdateCComercialesDto,
  UpdateImageDto,
} from './dto';

@ApiTags(CONST.MODULES.CCOMERCIALES.toUpperCase())
@Controller(CONST.MODULES.CCOMERCIALES)
export class CComercialesController {
  constructor(
    private readonly ccomercialesService: CComercialesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateCComercialesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.ccomercialesService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/all')
  async getAll(
    @Body() dto: GetAllxAtributoDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.ccomercialesService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.CCOMERCIALES}`,
    });
    let res = {
      statusCode: 200,
      data: data.items,
      meta: data.meta,
      links: data.links,
      message: ''
    }
    return res
  }

  @Auth()
  @Post('/apertura')
  async actualizarApertura(
    @Body() dto: GetAllxAtributoDto,
  ) {
    const data = await this.ccomercialesService.actualizarApertura(dto);
    let res = {
      statusCode: 200,
      data: data,
      message: 'Se ha actualizado la apertura del Centro Comercial'
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(
    @Param('id') id: number
  ) {
    const data = await this.ccomercialesService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateCComercialesDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.ccomercialesService.update(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.ccomercialesService.delete(id);
    return {
      statusCode: 200,
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
  ) {
    const data = await this.ccomercialesService.createImage(file, dto);
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
    const data = await this.ccomercialesService.updateImage(dto);
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
  ) {
    const data = await this.ccomercialesService.createImage(file, dto);
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
    const data = await this.ccomercialesService.deleteGaleria(dto);
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
    const data = await this.ccomercialesService.updateGaleria(dto);
    return {
      statusCode: 200,
      data,
      message: 'Se ha eliminado la imagen correctamente'
    };
  }

}
