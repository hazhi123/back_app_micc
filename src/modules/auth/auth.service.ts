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
  UsuariosInformacionEntity,
} from '../usuarios/entities/usuarios-informacion.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import {
  ChangePasswwordDto,
  RecoveryDto,
  RegisterDto,
} from './dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsuariosService,
    private readonly licenciasService: LicenciasService,

    @InjectRepository(UsuariosEntity)
    private readonly usuariosRP: Repository<UsuariosEntity>,

    @InjectRepository(UsuariosInformacionEntity)
    private readonly usuariosInformacionRP: Repository<UsuariosInformacionEntity>,

  ) { }

  async validateUser(usuario: string, contrasena: string): Promise<any | null> {
    const find = await this.userService.findUsuario(usuario)
    if (find) {
      const compararContrasena = await bcrypt.compare(contrasena, find.contrasena);
      delete find.contrasena
      if (compararContrasena) {
        return await this.getLogin(find.id);
      }
    }
    return null;
  }

  async getLogin(id: number) {
    const findOne = await this.usuariosRP.findOne({
      where: { id },
      select: [
        'id',
        'nombre',
        'apellido',
        'usuario',
        'status',
      ],
    })
    if (!findOne) throw new NotFoundException('Usuario no existe');
    delete findOne.licencia
    delete findOne.informacion
    return findOne;
  }

  async login(usuario: UsuariosEntity) {
    const { id } = usuario;
    const payload = { sub: id, isUser: true };
    return {
      usuario,
      accessToken: this.jwtService.sign(payload)
    }
  }

  async register(dto: RegisterDto) {
    if (dto.contrasena !== dto.contrasenaConfirm) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.ERROR.MATCH,
    }, HttpStatus.ACCEPTED)

    let isExist = await this.usuariosRP.findOne({ where: { usuario: dto.usuario } });
    if (isExist) throw new HttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: CONST.MESSAGES.USER.WARNING.EMAIL_CREATE,
    }, HttpStatus.ACCEPTED)

    let data = {
      nombre: dto.nombre,
      apellido: dto.apellido,
      ciudad: dto.ciudad,
      usuario: dto.usuario,
      contrasena: dto.contrasena,
      perfil: 5,
      createdBy: 0,
      createdAt: new Date(),
      updatedBy: 0,
      updatedAt: new Date(),
    };
    const create = await this.usuariosRP.create(data);
    const save = await this.usuariosRP.save(create);
    await this.usuariosInformacionRP.save({
      correo: dto.usuario,
      usuario: save.id
    });

    delete save.contrasena;

    const dataLic = {
      licencia: await codigoLincencia(),
      fechaInicio: moment().format('YYYY-MM-DD').toString(),
      fechaFinal: moment().add(20, 'days').format('YYYY-MM-DD').toString(),
      usuario: save.id,
      status: true
    }
    await this.licenciasService.create(dataLic, null)
    return {
      message: CONST.MESSAGES.COMMON.CREATE_DATA,
      data: save,
    };
  }

  async recovery(recover: RecoveryDto) {
    let isExist = await this.userService.findUsuario(recover.email);
    if (!isExist) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.NO_EMAIL,
    }, HttpStatus.ACCEPTED)
    return CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.SEND_EMAIL
  }

  async changePassword(change: ChangePasswwordDto) {


  }

}
