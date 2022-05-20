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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import { CreateContactosDto } from './dto';
import { ContactosEntity } from './entities/contactos.entity';

@Injectable()
export class ContactosService {

  relations = [
    'user',
    'ccomercial',
    'tienda',
  ]

  constructor(

    @InjectRepository(ContactosEntity)
    private readonly contactosRP: Repository<ContactosEntity>,

  ) { }

  async create(dto: CreateContactosDto, userLogin: UsersEntity) {
    await this.findContacto(dto)

    const save = await this.contactosRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });

    const getOne = await this.getOne(save.id)
    return getOne;
  }

  async getOne(id: number): Promise<ContactosEntity> {
    return await this.contactosRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async getAll(dto, options: IPaginationOptions): Promise<Pagination<ContactosEntity>> {
    const query = await this.contactosRP.createQueryBuilder('con')
      .leftJoinAndSelect("con.tiendaCC", "tieCC")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("con.user", "user")
      .leftJoinAndSelect("user.image", "img")
      .leftJoinAndSelect("con.ccomercial", "cc")
      .select([
        'con.id',
        'con.ultimoMensaje',
        'con.status',
        'tieCC.id',
        'tie.id',
        'tie.nombre',
        'user.id',
        'user.nombre',
        'user.apellido',
        'img.id',
        'img.file',
        'cc.id',
        'cc.nombre',
      ])
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('con.ccomercial = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      query.andWhere('tie.id = :tienda', { tienda: dto.tienda })
    }
    if (!isEmptyUndefined(dto.user)) {
      query.andWhere('con.user = :user', { user: dto.user })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('con.status = :status', { status: dto.status })
    }
    query.orderBy('con.id', 'DESC')
    query.getMany();
    return paginate<ContactosEntity>(query, options);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.contactosRP.delete(id);
    return getOne;
  }

  async findContacto(dto: CreateContactosDto) {
    let search = {}

    if (!isEmptyUndefined(dto.ccomercial)) search['ccomercial'] = dto.ccomercial
    if (!isEmptyUndefined(dto.tienda)) search['tienda'] = dto.tienda

    const findOne = await this.contactosRP.findOne({
      where: {
        ...search,
        user: dto.user
      }
    })

    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Este contactos ya se encuentra en la lista',
    }, HttpStatus.ACCEPTED)
  }

}
