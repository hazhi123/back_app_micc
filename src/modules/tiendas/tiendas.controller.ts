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
import {
  CreateTiendasDto,
  GetAllxAtributoDto,
  UpdateTiendasDto,
} from './dto';
import { TiendasService } from './tiendas.service';

@ApiTags(CONST.MODULES.TIENDAS.toUpperCase())
@Controller(CONST.MODULES.TIENDAS)
export class TiendasController {
  constructor(
    private readonly tiendasService: TiendasService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateTiendasDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.tiendasService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    limit = limit > 50 ? 50 : limit;
    const data = await this.tiendasService.getAll({
      page,
      limit,
      route: `${URLPAGE}/${CONST.MODULES.TIENDAS}`,
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
  @Post('/all')
  async getAllxAtributo(
    @Body() dto: GetAllxAtributoDto,
  ) {
    const data = await this.tiendasService.getAllxAtributo(dto);
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
    const data = await this.tiendasService.getOne(id);
    return {
      statusCode: 200,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() dto: UpdateTiendasDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.tiendasService.update(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.UPDATE_DATA
    }
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.tiendasService.delete(id);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.DELETE_DATA
    }
  }

  @Auth()
  @Post('/image/:id')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async createImage(
    @UploadedFile() file,
    @Param('id') id: number,
  ) {
    const data = await this.tiendasService.createImage(file, id, null);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Post('/galeria/:index/:id')
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async createGaleria(
    @UploadedFile() file,
    @Param('index') index: number,
    @Param('id') id: number,
  ) {
    const data = await this.tiendasService.createImage(file, id, index);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

  @Auth()
  @Get('/galeria_del/:index/:id')
  async createGaleriaDel(
    @Param('index') index: number,
    @Param('id') id: number,
  ) {
    const data = await this.tiendasService.createImageDel(id, index);
    return {
      statusCode: 200,
      data,
      message: 'Se ha eliminado la imagen correctamente'
    };
  }

}
