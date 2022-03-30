import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as CONST from '../../common/constants';
import { PerfilesService } from '../perfiles/perfiles.service';
import { UsersEntity } from '../users/entities/users.entity';
import { CreateContactosDto } from './dto';
import { ContactosEntity } from './entities/contactos.entity';
import { isEmptyUndefined } from '../../common/helpers';

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
    let search = {}
    if (!isEmptyUndefined(dto.ccomercial)) search['ccomercial'] = dto.ccomercial
    if (!isEmptyUndefined(dto.tienda)) search['tienda'] = dto.tienda
    if (!isEmptyUndefined(dto.user)) search['user'] = dto.user
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status

    return paginate<ContactosEntity>(this.contactosRP, options, {
      where: search,
      relations: this.relations,
      order: { 'id': 'DESC' },
    });

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
