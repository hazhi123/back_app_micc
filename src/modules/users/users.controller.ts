import {
  Body,
  Controller,
  Delete,
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
import {
  CreateImageDto,
  createUsersDto,
  GetAllxAtributoDto,
  updatedUsersDto,
  UpdateImageDto,
} from './dto';
import { UsersEntity } from './entities/users.entity';
import { UsersService } from './users.service';

@ApiTags(CONST.MODULES.USERS.USERS.toUpperCase())
@Controller(CONST.MODULES.USERS.USERS)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,

  ) { }

  @Auth()
  @Post()
  async create(
    @Body() UserDto: createUsersDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.usersService.create(false, UserDto, userLogin);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    }
  }

  @Auth()
  @Get()
  async getAll(@UserLogin() userLogin: UsersEntity) {
    const data = await this.usersService.getAll();
    const res = {
      statusCode: HttpStatus.OK,
      data,
      entries: data.length,
      message: ''
    }
    return res;
  }

  @Auth()
  @Post('/all')
  async getAllxAtributo(
    @Body() dto: GetAllxAtributoDto,
  ) {
    const data = await this.usersService.getAllxAtributo(dto);
    let res = {
      statusCode: HttpStatus.OK,
      data: data,
      message: ''
    }
    return res
  }

  @Auth()
  @Get(':id')
  async getOne(
    @Param('id') id: number,
    @UserLogin() userLogin: UsersEntity
  ) {
    const data = await this.usersService.getOne(id);
    return {
      statusCode: HttpStatus.OK,
      data,
      message: isEmptyUndefined(data) ? CONST.MESSAGES.COMMON.WARNING.NO_DATA_FOUND : CONST.MESSAGES.COMMON.FOUND_DATA
    }
  }

  @Auth()
  @Patch()
  async update(
    @Body() userDto: updatedUsersDto,
    @UserLogin() userLogin: UsersEntity
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
    @UserLogin() userLogin: UsersEntity
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

}
