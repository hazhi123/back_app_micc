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
import {
  AsignarCComercialesDto,
  CreateImageDto,
  createUsuariosDto,
  GetAllDto,
  updatedUsuariosDto,
  UpdateImageDto,
} from './dto';
import { UsuariosEntity } from './entities/usuarios.entity';
import { UsuariosService } from './usuarios.service';

const USUARIOS = 'usuarios'

@ApiTags('Usuarios')
@Controller(USUARIOS)
export class UsuariosController {
  constructor(
    private readonly usersService: UsuariosService,

  ) { }

  @Auth()
  @Post()
  async create(
    @Body() UserDto: createUsuariosDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.usersService.create(UserDto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    }
  }

  @Auth()
  @Post('/all')
  async getAll(
    @Body() dto: GetAllDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number = 50,
  ) {
    const data = await this.usersService.getAll(dto, {
      page,
      limit,
      route: `${URLPAGE}/${USUARIOS}/all`,
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
    @Param('id') id: number,
  ) {
    const data = await this.usersService.getOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : ''
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() userDto: updatedUsuariosDto,
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.usersService.update(userDto, userLogin);;
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
    const data = await this.usersService.delete(id);;
    return {
      statusCode: HttpStatus.OK,
      data: data,
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
    @UserLogin() userLogin: UsuariosEntity
  ) {
    const data = await this.usersService.createImage(file, dto, userLogin);
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
    const data = await this.usersService.updateImage(dto);
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
    let data = await this.usersService.asignarCComerciales(dto);
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
    const data = await this.usersService.getCComerciales(id, {
      page,
      limit,
      route: `${URLPAGE}/${USUARIOS}/${id}/ccomerciales`,
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