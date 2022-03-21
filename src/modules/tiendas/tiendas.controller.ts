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
  async getAll() {
    const data = await this.tiendasService.getAll();
    let res = {
      statusCode: 200,
      data: data,
      message: ''
    }
    return res
  }

  @Auth()
  @Post('/all/atributo')
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

  // @Auth()
  // @Post('/image/:id')
  // @UseInterceptors(
  //   FileInterceptor('file'),
  // )
  // async createImage(
  //   @UploadedFile() file,
  //   @Param('id') id: number,
  // ) {
  //   const data = await this.tiendasService.createImage(file, id);
  //   return {
  //     statusCode: 200,
  //     data,
  //     message: CONST.MESSAGES.COMMON.CREATE_DATA
  //   };
  // }

}
