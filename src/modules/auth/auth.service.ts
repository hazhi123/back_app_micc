import * as bcrypt from 'bcrypt';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as CONST from '../../common/constants';
import { createUsersDto } from '../users/dto';
import { UsersEntity } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import {
  ChangePasswwordDto,
  RecoveryPasswordDto,
} from './dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(user: string, password: string): Promise<any | null> {
    const find = await this.userService.findUser(user)
    if (find && find.status) {
      const comparePassword = await bcrypt.compare(password, find.password);
      delete find.password
      if (comparePassword) {
        return await this.userService.getOne(find.id)
      }
    }
    return null;
  }

  login(user: UsersEntity) {
    const { id, ...rest } = user;
    const payload = { sub: id, isUser: true };
    return {
      user,
      accessToken: this.jwtService.sign(payload)
    }
  }

  async register(user: createUsersDto) {
    if (user.password !== user.passwordConfirm) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.ERROR.MATCH,
    }, HttpStatus.ACCEPTED)
    let isExist = await this.userService.findUser(user.user);
    if (isExist) throw new HttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: CONST.MESSAGES.USER.WARNING.EMAIL_CREATE,
    }, HttpStatus.ACCEPTED)
    const data = {
      ...user,
      isVisitante: true,
      perfil: 3,
    }
    const res = await this.userService.create(true, data, null)
    delete res.id
    delete res.status
    delete res.isVisitante
    delete res.createdBy
    delete res.createdAt
    delete res.updatedBy
    delete res.updatedAt

    return {
      message: CONST.MESSAGES.COMMON.CREATE_DATA,
      data: res,
    };
  }

  async recovery(recover: RecoveryPasswordDto) {
    let isExist = await this.userService.findUser(recover.email);
    if (!isExist) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.NO_EMAIL,
    }, HttpStatus.ACCEPTED)
    return CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.SEND_EMAIL
  }

  async changePassword(change: ChangePasswwordDto) {


  }

}
