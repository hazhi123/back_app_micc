import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { codigoLincencia } from '../../utils/create-licenses-free';
import { LicenciasService } from '../licencias/licencias.service';
import {
  UsersInformacionEntity,
} from '../users/entities/users-informacion.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import {
  ChangePasswwordDto,
  RecoveryPasswordDto,
  registerDto,
} from './dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRP: Repository<UsersEntity>,

    @InjectRepository(UsersInformacionEntity)
    private readonly usersInformacionRP: Repository<UsersInformacionEntity>,

    private readonly userService: UsersService,
    private readonly licenciasService: LicenciasService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(user: string, password: string): Promise<any | null> {
    const find = await this.userService.findUser(user)
    if (find) {
      const comparePassword = await bcrypt.compare(password, find.password);
      delete find.password
      if (comparePassword) {
        return await this.getLogin(find.id);
      }
    }
    return null;
  }

  async getLogin(id: number) {
    const findOne = await this.usersRP.findOne({
      where: { id },
    })
    if (!findOne) throw new NotFoundException('Usuario no existe');
    return findOne;
  }

  login(user: UsersEntity) {
    const { id, ...rest } = user;
    const payload = { sub: id, isUser: true };
    return {
      user,
      accessToken: this.jwtService.sign(payload)
    }
  }

  async register(dto: registerDto) {
    if (dto.password !== dto.passwordConfirm) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.ERROR.MATCH,
    }, HttpStatus.ACCEPTED)

    let isExist = await this.usersRP.findOne({ where: { user: dto.user } });
    if (isExist) throw new HttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: CONST.MESSAGES.USER.WARNING.EMAIL_CREATE,
    }, HttpStatus.ACCEPTED)

    let data = {
      nombre: dto.nombre,
      apellido: dto.apellido,
      ciudad: dto.ciudad,
      user: dto.user,
      password: dto.password,
      isVisitante: true,
      perfil: 5,
      createdBy: 0,
      createdAt: new Date(),
      updatedBy: 0,
      updatedAt: new Date(),
    };
    const create = await this.usersRP.create(data);
    const save = await this.usersRP.save(create);
    await this.usersInformacionRP.save({
      correo: dto.user,
      user: save.id
    });

    delete save.password;

    const dataLic = {
      licencia: await codigoLincencia(),
      fechaInicio: moment().format('YYYY-MM-DD').toString(),
      fechaFinal: moment().add(20, 'days').format('YYYY-MM-DD').toString(),
      user: save.id,
      status: true
    }
    await this.licenciasService.create(dataLic, null)
    return {
      message: CONST.MESSAGES.COMMON.CREATE_DATA,
      data: save,
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
