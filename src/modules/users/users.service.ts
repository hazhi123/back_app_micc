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
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import {
  createUsersDto,
  GetAllxAtributoDto,
  updatedUsersDto,
} from './dto';
import { UsersInformacionEntity } from './entities/users-informacion.entity';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UsersService {

  relations = [
    'perfil',
    'informacion',
    'licencia',
    'pais',
    'ccomercial',
    'ccomercial.pais',
    'tienda',
    'tienda.categoria',
    'ccomerciales',
    'ccomerciales.ccomercial',
    'ccomerciales.ccomercial.pais',
  ]

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRP: Repository<UsersEntity>,

    @InjectRepository(UsersInformacionEntity)
    private readonly informacionRP: Repository<UsersInformacionEntity>,

    @InjectRepository(GaleriaEntity)
    private readonly galeriaRP: Repository<GaleriaEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(isRegister, dto: createUsersDto, userLogin: UsersEntity) {
    // Valida el usuario si existe
    const userExist = await this.findUser(dto.user);
    if (!isEmptyUndefined(userExist)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Este usuario ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)

    const {
      nombre,
      apellido,
      user,
      isVisitante,
      pais,
      imageUrl,
      imageBack,
      password,
      ccomercial,
      tienda,
      perfil,
      status,
      dni,
      direccion,
      celular,
      telefono,
    } = dto

    // Es cuando el usuario se registra.
    if (isRegister && !userLogin) {
      if (dto.password !== dto.passwordConfirm) throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: CONST.MESSAGES.AUTH.RECOVERY_PASSWORD.ERROR.MATCH,
      }, HttpStatus.ACCEPTED)
      let data = {
        nombre,
        apellido,
        user,
        pais,
        isVisitante: true,
        perfil: 3,
        password,
        createdBy: 0,
        createdAt: new Date(),
        updatedBy: 0,
        updatedAt: new Date(),
      };
      const create = await this.usersRP.create(data);
      const save = await this.usersRP.save(create);
      await this.informacionRP.save({
        correo: dto.user,
        user: save.id
      });
      delete save.password;
      return save;
    }

    // // Valida el numero de celular
    // await this.findCelular(dto.celular);

    // // Valida el dni si existe
    // await this.findDni(dto.dni);

    const create = await this.usersRP.create({
      nombre,
      apellido,
      user,
      imageUrl,
      imageBack,
      password,
      ccomercial,
      tienda,
      isVisitante,
      pais,
      perfil,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status,
    });
    const save = await this.usersRP.save(create);

    await this.informacionRP.save({
      dni,
      celular,
      direccion,
      correo: dto.user,
      telefono,
      user: save.id
    });
    const getOne = await this.getOne(save.id)
    delete getOne.password;
    return getOne;
  }

  async getAll(isShowPassword: boolean = false) {
    const find = await this.usersRP.find({
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    const arr = find.map(el => {
      if (!isShowPassword) delete el.password;
      return el;
    });
    return arr;
  }

  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<UsersEntity[]> {
    let search = {}
    if (!isEmptyUndefined(dto.ccomercial)) search['ccomercial'] = dto.ccomercial
    if (!isEmptyUndefined(dto.tienda)) search['tienda'] = dto.tienda
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    const find = await this.usersRP.find({
      where: search,
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
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

    let { id,
      nombre,
      apellido,
      user,
      pais,
      imageUrl,
      imageBack,
      password,
      perfil,
      status,
      celular,
      ccomercial,
      isVisitante,
      tienda,
      dni,
      direccion,
      telefono,
    } = dto

    const dataInformacion = {
      dni,
      celular,
      direccion,
      correo: user,
      telefono,
      user: id,
    }
    if (isEmptyUndefined(getOne.informacion)) {
      await this.informacionRP.save(dataInformacion);
    } else {
      const assinginformacion = Object.assign(getOne.informacion, dataInformacion)
      await this.informacionRP.update(getOne.informacion.user, assinginformacion);
    }

    delete getOne.informacion
    delete getOne.licencia
    delete getOne.publicaciones
    delete getOne.comentarios
    delete getOne.likes
    delete getOne.ccomerciales

    if (isVisitante) {
      getOne['ccomercial'] = null;
      getOne['tienda'] = null;
      ccomercial = null;
      tienda = null;
    }

    const objectUsers = Object.assign(getOne, {
      nombre,
      apellido,
      user,
      pais,
      imageUrl,
      imageBack,
      password,
      isVisitante,
      perfil,
      ccomercial,
      tienda,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status,
    })
    if (isEmptyUndefined(dto.password)) {
      delete objectUsers.password
    }
    await this.usersRP.update(getOne.id, objectUsers);

    const res = await this.getOne(dto.id);
    delete res.password;
    return res;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id, null)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    await this.usersRP.createQueryBuilder()
      .update(UsersEntity)
      .set({ status: false })
      .where("id = :id", { id })
      .execute();
    // await this.usersRP.delete(id);
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

  async createImage(file: any, id: number, isBack: boolean,) {
    let image
    try {
      image = await this.uploadImageToCloudinary(file)
      this.galeriaRP.createQueryBuilder()
        .insert()
        .into(GaleriaEntity)
        .values({
          titular: 'user',
          refId: id,
          file: image.url
        })
        .execute();
    } catch (error) {
      image = { url: '' }
    }

    if (isBack) {
      await this.usersRP.createQueryBuilder()
        .update(UsersEntity)
        .set({ imageBack: image.url })
        .where("id = :id", { id })
        .execute();
    } else {
      await this.usersRP.createQueryBuilder()
        .update(UsersEntity)
        .set({ imageUrl: image.url })
        .where("id = :id", { id })
        .execute();
    }
    return await this.getOne(id);

  }

}