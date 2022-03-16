import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import * as CONST from '../../common/constants';
import {
  Auth,
  UserLogin,
} from '../../common/decorators';
import { UsersEntity } from '../users/entities/users.entity';
import { CreatePerfilesModulosDto } from './dto';
import { PerfilesModulosService } from './perfiles-modulos.service';

@ApiTags(CONST.MODULES.USERS.PERFILES_MODULOS.toUpperCase())
@Controller(CONST.MODULES.USERS.PERFILES_MODULOS)
export class PerfilesModulosController {
  constructor(
    private readonly profilesModulosService: PerfilesModulosService
  ) { }

  @Auth()
  @Post()
  async create(
    @Body() dto: CreatePerfilesModulosDto,
    @UserLogin() userLogin: UsersEntity
  ) {
    let data = await this.profilesModulosService.create(dto, userLogin);
    return {
      statusCode: 200,
      data,
      message: CONST.MESSAGES.COMMON.CREATE_DATA
    };
  }

}
