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
import {
  TiendasCComercialesEntity,
} from '../tiendas/entities/tiendas-ccomerciales.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { CreateContactosDto } from './dto';
import { ContactosEntity } from './entities/contactos.entity';

@Injectable()
export class ContactosService {

  constructor(

    @InjectRepository(ContactosEntity)
    private readonly contactosRP: Repository<ContactosEntity>,

    @InjectRepository(TiendasCComercialesEntity)
    private readonly tiendasCcomercialesRP: Repository<TiendasCComercialesEntity>,

  ) { }

  async create(dto: CreateContactosDto, userLogin: UsuariosEntity) {
    const one = await this.tiendasCcomercialesRP.findOne({
      where: {
        ccomercial: dto.ccomercial,
        tienda: dto.tienda,
      }
    })

    const findOne = await this.contactosRP.findOne({
      where: {
        user: dto.user,
        tiendaCC: one.id,
      }
    })

    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Esta tienda ya se encuentra en la lista de contactos',
    }, HttpStatus.ACCEPTED)

    const save = await this.contactosRP.save({
      user: dto.user,
      tiendaCC: one.id,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });

    const getOne = await this.getOne(save.id)
    return getOne;
  }

  async getOne(id: number): Promise<ContactosEntity> {
    const getOne = await this.contactosRP
      .createQueryBuilder("con")
      .leftJoinAndSelect("con.tienda", "ti")
      .leftJoinAndSelect("ti.image", "imgGal")
      .leftJoinAndSelect("ti.imageBack", "imgBackGal")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.desc',
        'ti.status',
        'ti.isGastro',
        'imgGal.id',
        'imgGal.file',
        'imgBackGal.id',
        'imgBackGal.file',
      ])
      .where('con.id = :id', { id })
      .getOne()
    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async getAll(dto, options: IPaginationOptions): Promise<Pagination<ContactosEntity>> {
    const query = await this.contactosRP.createQueryBuilder('con')
      .leftJoinAndSelect("con.tiendaCC", "tieCC")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tiImgGal")
      .leftJoinAndSelect("tie.imageBack", "tiImgBackGal")
      .leftJoinAndSelect("con.user", "user")
      .leftJoinAndSelect("user.image", "usimgGal")
      .leftJoinAndSelect("user.image", "usimgBackGal")
      .select([
        'con.id',
        'con.ultimoMensaje',
        'con.status',
        'tieCC.id',
        'tieCC.ubicacion',
        'tieCC.correo',
        'tieCC.telPrimero',
        'tie.id',
        'tie.nombre',
        'user.id',
        'user.nombre',
        'user.apellido',
        'usimgGal.id',
        'usimgGal.file',
        'usimgBackGal.id',
        'usimgBackGal.file',
        'tiImgGal.id',
        'tiImgGal.file',
        'tiImgBackGal.id',
        'tiImgBackGal.file',
      ])
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

}
