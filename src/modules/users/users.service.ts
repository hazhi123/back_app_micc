import { Repository } from 'typeorm';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import {
  createUsersDto,
  updatedUsersDto,
} from './dto';
import {
  UsersInformacionEntity,
} from './entities/users-informacion.entity';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UsersService {

  relations = [
    'perfil',
    'informacion',
    'licencia',
  ]

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRP: Repository<UsersEntity>,

    @InjectRepository(UsersInformacionEntity)
    private readonly informacionRP: Repository<UsersInformacionEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(isRegister, dto: createUsersDto, userLogin: UsersEntity) {
    // Valida el usuario si existe
    const userExist = await this.findUser(dto.user);
    if (!isEmptyUndefined(userExist)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Este usuario ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)

    // Valida el numero de celular
    await this.findCelular(dto.celular);
    // Valida el dni si existe
    await this.findDni(dto.dni);

    // Es cuando el usuario se registra.
    if (isRegister && !userLogin) {
      if (dto.password !== dto.passwordConfirm) throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.ERROR.MATCH,
      }, HttpStatus.ACCEPTED)
      let data = {
        nombre: dto.nombre,
        apellido: dto.apellido,
        user: dto.user,
        image: dto.image,
        password: dto.password,
        perfil: 3,
        createdBy: userLogin.id,
        createdAt: new Date(),
        updatedBy: userLogin.id,
        updatedAt: new Date(),
        status: dto.status,
      };
      const create = await this.usersRP.create(data);
      const save = await this.usersRP.save(create);
      delete save.password;
      return save;
    }

    const create = await this.usersRP.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      user: dto.user,
      image: dto.image,
      password: dto.password,
      perfil: dto.perfil,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: dto.status,
    });
    const save = await this.usersRP.save(create);

    await this.informacionRP.save({
      dni: dto.dni,
      celular: dto.celular,
      direccion: dto.direccion,
      correo: dto.user,
      telefono: dto.telefono,
      user: save.id
    });
    const getOne = await this.getOne(save.id)
    delete getOne.password;
    return getOne;
  }

  async getAll(isShowPassword: boolean = false) {
    const find = await this.usersRP.find({
      where: { isAdmin: true },
      relations: this.relations,
      order: { 'id': 'DESC' },
    });
    if (isEmptyUndefined(find)) return null
    const arr = find.map(el => {
      if (!isShowPassword) delete el.password;
      return el;
    });
    return arr;
  }

  async getAllBusiness(empresa: number) {
    const find = await this.usersRP.find({
      where: { empresa },
      relations: this.relations,
      order: { 'id': 'DESC' },
    });
    if (isEmptyUndefined(find)) return null
    const arr = find.map(el => {
      delete el.password;
      return el;
    });
    return arr;
  }

  async getOne(id: number, userLogin?: UsersEntity) {
    const findOne = await this.usersRP.findOne({
      where: { id },
      relations: this.relations
    })
      .then(u => !userLogin ? u : !!u && userLogin.id === u.id ? u : null)
    if (!findOne) throw new NotFoundException('Usuario no existe');
    return findOne;
  }

  async update(dto: updatedUsersDto, userLogin: UsersEntity) {
    const getOne = await this.getOne(dto.id, null)
    if (!getOne) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    const dataAdditional = {
      dni: dto.dni,
      celular: dto.celular,
      direccion: dto.direccion,
      correo: dto.user,
      telefono: dto.telefono,
      user: dto.id
    }
    if (isEmptyUndefined(getOne.informacion)) {
      await this.informacionRP.save(dataAdditional);
    } else {
      const assinginformacion = Object.assign(getOne.informacion, dataAdditional)
      await this.informacionRP.update(getOne.informacion.user, assinginformacion);
    }

    delete getOne.informacion
    delete getOne.licencia

    const objectUsers = Object.assign(getOne, {
      nombre: dto.nombre,
      apellido: dto.apellido,
      user: dto.user,
      image: dto.image,
      password: dto.password,
      perfil: dto.perfil,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: dto.status,
    })
    if (isEmptyUndefined(dto.password)) {
      delete objectUsers.password
    }
    await this.usersRP.update(getOne.id, objectUsers);

    const res = await this.getOne(dto.id);
    delete res.password;
    return res;
  }

  async perfilUpdate(dto: updatedUsersDto, userLogin: UsersEntity) {
    const findOne = await this.usersRP.findOne({
      where: { id: dto.id },
      relations: ['informacion'],
    });
    const dataInformacion = {
      dni: dto.dni,
      celular: dto.celular,
      direccion: dto.direccion,
      correo: dto.user,
      telefono: dto.telefono,
    }
    if (isEmptyUndefined(findOne.informacion)) {
      await this.informacionRP.save(dataInformacion);
    } else {
      const assinginformacion = Object.assign(findOne.informacion, dataInformacion)
      await this.informacionRP.update(findOne.id, assinginformacion);
    }

    delete findOne.informacion
    delete findOne.licencia

    const assingUsers = Object.assign(findOne, {
      nombre: dto.nombre,
      apellido: dto.apellido,
      password: dto.password,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    })
    await this.usersRP.update(dto.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id, null)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    await this.usersRP.delete(id);
    return getOne;
  }

  async findUser(user: string) {
    return await this.usersRP
      .createQueryBuilder('user')
      .where({ user })
      .addSelect('user.password')
      .getOne()
  }

  async findCelular(celular: string) {
    const findOne = await this.informacionRP.findOne({
      where: { celular }
    })
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.USER.WARNING.MOBILE_CREATE,
    }, HttpStatus.ACCEPTED)
  }

  async findDni(dni: string) {
    const findOne = await this.informacionRP.findOne({
      where: { dni }
    })
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'El dni ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async createImage(file: any, id: number) {
    let image
    try {
      image = await this.uploadImageToCloudinary(file)
    } catch (error) {
      image = { url: '' }
    }
    await this.usersRP.createQueryBuilder()
      .update(UsersEntity)
      .set({ image: image.url })
      .where("id = :id", { id })
      .execute();
    return await this.getOne(id);
  }

}