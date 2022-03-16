import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';

import * as CONST from '../../common/constants';
import { UserLogin } from '../../common/decorators';
import { createUsersDto } from '../users/dto';
import { UsersEntity } from '../users/entities/users.entity';
import { AuthService } from './auth.service';
import {
  ChangePasswwordDto,
  RecoveryPasswordDto,
} from './dto';
import { LocalAuthGuard } from './guards';

// @ApiTags(CONST.MODULES.AUTH.AUTH.toUpperCase())
@Controller(CONST.MODULES.AUTH.AUTH)
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post(CONST.MODULES.AUTH.LOGIN)
  async login(
    @UserLogin() user: UsersEntity
  ) {
    const data = await this.authService.login(user)
    return {
      statusCode: HttpStatus.OK,
      ...data
    }
  }

  @Post(CONST.MODULES.AUTH.REGISTER)
  async register(@Body() userDto: createUsersDto) {
    const data = await this.authService.register(userDto)
    return {
      statusCode: HttpStatus.OK,
      ...data
    }
  }


  @Post(CONST.MODULES.AUTH.RECOVERY_PASSWORD)
  async recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    const data = await this.authService.recovery(recoveryPasswordDto)
    return {
      statusCode: HttpStatus.OK,
      message: data,
    }
  }

  @Post(CONST.MODULES.AUTH.CHANGE_PASSWORD)
  async changePassword(@Body() change: ChangePasswwordDto) {

    if (change.password !== change.passwordConfirm) throw new NotFoundException(CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.ERROR.MATCH);

    const data = await this.authService.changePassword(change)
    return {
      statusCode: HttpStatus.OK,
    }
  }

}

