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
import { ContactosEntity } from '../contactos/entities/contactos.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { CreateMensajesDto } from './dto';
import { MensajesEntity } from './entities/mensajes.entity';

@Injectable()
export class MensajesService {

  relations = [
    'contacto',
    'user',
  ]

  constructor(

    @InjectRepository(MensajesEntity)
    private readonly mensajesRP: Repository<MensajesEntity>,

    @InjectRepository(ContactosEntity)
    private readonly contactosRP: Repository<ContactosEntity>,

  ) { }

  async create(dto: CreateMensajesDto, userLogin: UsuariosEntity) {

    const save = await this.mensajesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });

    await this.contactosRP.createQueryBuilder()
      .update(ContactosEntity)
      .set({ ultimoMensaje: dto.mensaje })
      .where("id = :id", { id: dto.contacto })
      .execute();

    const getOne = await this.getOne(save.id)
    return getOne;
  }

  async getOne(id: number): Promise<MensajesEntity> {
    return await this.mensajesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async getAll(dto, options: IPaginationOptions): Promise<Pagination<MensajesEntity>> {

    let search = {}

    if (!isEmptyUndefined(dto.contacto)) search['contacto'] = dto.contacto
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status

    return paginate<MensajesEntity>(this.mensajesRP, options, {
      where: {
        status: true,
        ...search
      },
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
    await this.mensajesRP.delete(id);
    return getOne;
  }

}
