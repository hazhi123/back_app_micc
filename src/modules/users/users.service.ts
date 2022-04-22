import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { GaleriaService } from '../galeria/galeria.service';
import {
  CreateImageDto,
  createUsersDto,
  GetAllDto,
  updatedUsersDto,
  UpdateImageDto,
} from './dto';
import { UsersInformacionEntity } from './entities/users-informacion.entity';
import { UsersEntity } from './entities/users.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRP: Repository<UsersEntity>,

    @InjectRepository(UsersInformacionEntity)
    private readonly informacionRP: Repository<UsersInformacionEntity>,

    private galeriaService: GaleriaService
  ) { }

  async create(isRegister, dto: createUsersDto, userLogin: UsersEntity) {
    // Valida el usuario si existe
    const userExist = await this.findUser(dto.user);
    if (!isEmptyUndefined(userExist)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Este usuario ya se encuentra registrado',
    }, HttpStatus.ACCEPTED)

    const {
      nombre, apellido, user, isVisitante, pais, password, ccomercial, tienda, perfil, status, dni, direccion, celular, telefono, ciudad, isTienda,
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
        ciudad,
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
      password,
      ccomercial,
      tienda,
      isVisitante,
      pais,
      ciudad,
      isTienda,
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
    return getOne;
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<UsersEntity>> {
    const query = await this.usersRP
      .createQueryBuilder("user")
    query.leftJoinAndSelect("user.perfil", "per")
      .leftJoinAndSelect("user.image", "userGal")
      .leftJoinAndSelect("user.imageBack", "userGalBack")
      .leftJoinAndSelect("user.pais", "pais")
      .leftJoinAndSelect("user.ciudad", "ciu")
      .leftJoinAndSelect("user.informacion", "inf")
      .leftJoinAndSelect("user.ccomercial", "cc")
      .leftJoinAndSelect("user.tienda", "tie")
      .select([
        'user.id',
        'user.nombre',
        'user.apellido',
        'user.user',
        'user.status',
        'userGal.id',
        'userGal.file',
        'userGalBack.id',
        'userGalBack.file',
        'per.id',
        'per.nombre',
        'pais.id',
        'pais.nombre',
        'cc.id',
        'cc.nombre',
        'tie.id',
        'tie.nombre',
        'ciu.id',
        'ciu.nombre',
        'inf.user',
        'inf.celular',
        'inf.dni',
      ])
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccId', { ccId: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      query.andWhere('tie.id = :tieId', { tieId: dto.tienda })
    }
    if (!isEmptyUndefined(dto.isVisitante)) {
      query.andWhere('user.isVisitante = :valor', { valor: dto.isVisitante })
    }
    if (!isEmptyUndefined(dto.isTienda)) {
      query.andWhere('user.isTienda = :valor', { valor: dto.isTienda })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('user.status = :valor', { valor: dto.status })
    }
    query.addOrderBy("user.nombre", "ASC")
    query.getMany();
    return paginate<UsersEntity>(query, options);
  }

  async getLogin(id: number, userLogin?: UsersEntity) {
    const findOne = await this.usersRP.findOne({
      where: { id },
      relations: [
        'ccomercial',
        'tienda',
        'ccomerciales',
        'ccomerciales.ccomercial',
        'perfil',
        'pais',
        'ciudad',
      ],
    })
      .then(u => !userLogin ? u : !!u && userLogin.id === u.id ? u : null)
    if (!findOne) throw new NotFoundException('Usuario no existe');
    return findOne;
  }

  async getOne(id: number) {
    const getOne = await this.usersRP
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.perfil", "per")
      .leftJoinAndSelect("user.image", "userGal")
      .leftJoinAndSelect("user.imageBack", "userGalBack")
      .leftJoinAndSelect("user.pais", "pais")
      .leftJoinAndSelect("user.ciudad", "ciu")
      .leftJoinAndSelect("user.informacion", "inf")
      .leftJoinAndSelect("user.ccomercial", "cc")
      .leftJoinAndSelect("user.tienda", "tie")
      .select([
        'user.id',
        'user.nombre',
        'user.apellido',
        'user.user',
        'user.createdBy',
        'user.createdAt',
        'user.updatedBy',
        'user.updatedAt',
        'user.status',
        'user.isTienda',
        'user.isVisitante',
        'userGal.id',
        'userGal.file',
        'userGalBack.id',
        'userGalBack.file',
        'per.id',
        'per.nombre',
        'tie.id',
        'tie.nombre',
        'cc.id',
        'cc.nombre',
        'pais.id',
        'pais.nombre',
        'ciu.id',
        'ciu.nombre',
        'inf.user',
        'inf.dni',
        'inf.celular',
        'inf.direccion',
        'inf.telefono',
      ])
      .where('user.id = :id', { id })
      .getOne()

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: updatedUsersDto, userLogin: UsersEntity) {
    const getOne = await this.getOne(dto.id)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    let {
      id, nombre, apellido, user, pais, ciudad, password, perfil, status, celular, ccomercial, isVisitante, tienda, dni, isTienda, direccion, telefono,
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
      await this.informacionRP.update(getOne.id, assinginformacion);
    }

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
      ciudad,
      password,
      isVisitante,
      isTienda,
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

    delete getOne.informacion
    await this.usersRP.update(getOne.id, objectUsers);

    const res = await this.getOne(dto.id);
    return res;
  }

  async delete(id: number) {
    const getOne = await this.getOne(id)
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    await this.usersRP.update(id, { status: false });
    return await this.getOne(id);
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

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {

    const getOne = await this.usersRP.findOne({
      where: { id: dto.user },
    })
    if (userLogin.isVisitante) {
      if (parseInt(dto.isBack) == 0) {
        if (!isEmptyUndefined(getOne.image)) {
          await this.galeriaService.delete(getOne.image)
        }
      } else {
        if (!isEmptyUndefined(getOne.imageBack)) {
          await this.galeriaService.delete(getOne.imageBack)
        }
      }
    }

    let galeriaId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: 'user',
        entId: parseInt(dto.user),
        referencia: 'user',
        refId: parseInt(dto.user),
      }
      res = await this.galeriaService.create(file, data, userLogin)
      galeriaId = res.id
    } catch (error) {
      galeriaId = null
      res = null
    }

    if (parseInt(dto.isBack) == 0) {
      await this.usersRP.update(parseInt(dto.user),
        { image: galeriaId }
      );
    } else {
      await this.usersRP.update(parseInt(dto.user),
        { imageBack: galeriaId }
      );
    }
    return res;
  }

  async updateImage(dto: UpdateImageDto) {
    await this.usersRP.update(dto.user,
      dto.isBack ? { imageBack: dto.galeria } : { image: dto.galeria }
    );
    return await this.getOne(dto.user);
  }

}