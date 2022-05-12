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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../../common/decorators';
import { isEmptyUndefined } from '../../../common/helpers';
import { URLPAGE } from '../../../config';
import { UsersEntity } from '../../users/entities/users.entity';
import { CinesService } from './cines.service';
import {
  CreateCinesDto,
  GetAllDto,
  UpdateCinesDto,
} from './dto';

@ApiTags(CONST.MODULES.CINES.CINES)
@Controller(CONST.MODULES.CINES.CINES)
export class CinesController {
  constructor(
    private readonly cinesService: CinesService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreateCinesDto,
    @UserLogin() userLogin: UsersEntity
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
      route: `${URLPAGE}/${CONST.MODULES.PLANES}`,
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
    @UserLogin() userLogin: UsersEntity
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

}
