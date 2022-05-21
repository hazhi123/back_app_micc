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
import { createUsuariosDto } from '../usuarios/dto';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { AuthService } from './auth.service';
import {
  ChangePasswwordDto,
  RecoveryDto,
} from './dto';
import { LocalAuthGuard } from './guards';

// @ApiTags('Authenticación')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @UserLogin() user: UsuariosEntity
  ) {
    const data = await this.authService.login(user)
    return {
      statusCode: HttpStatus.OK,
      ...data
    }
  }

  @Post('register')
  async register(@Body() userDto: createUsuariosDto) {
    const data = await this.authService.register(userDto)
    return {
      statusCode: HttpStatus.OK,
      ...data
    }
  }


  @Post('recover')
  async recoveryPassword(@Body() recoveryPasswordDto: RecoveryDto) {
    const data = await this.authService.recovery(recoveryPasswordDto)
    return {
      statusCode: HttpStatus.OK,
      message: data,
    }
  }

  @Post('changedPassword')
  async changePassword(@Body() change: ChangePasswwordDto) {

    if (change.password !== change.passwordConfirm) throw new NotFoundException(CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.ERROR.MATCH);

    const data = await this.authService.changePassword(change)
    return {
      statusCode: HttpStatus.OK,
    }
  }

}

