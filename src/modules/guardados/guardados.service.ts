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
import { CreateGuardadosDto } from './dto';
import { GuardadosEntity } from './entities/guardados.entity';
import { isEmptyUndefined } from '../../common/helpers';

@Injectable()
export class GuardadosService {

  relations = [
    'user',
    'publicacion',
  ]

  constructor(
    private readonly guardadosService: PerfilesService,

    @InjectRepository(GuardadosEntity)
    private readonly guardadosRP: Repository<GuardadosEntity>,

  ) { }

  async create(dto: CreateGuardadosDto, userLogin: UsersEntity) {

    const findOne = await this.guardadosRP.findOne({
      where: {
        user: dto.user,
        publicacion: dto.publicacion
      }
    })

    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Esta publicación se encuentra guardada',
    }, HttpStatus.ACCEPTED)

    const save = await this.guardadosRP.save({
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

  async getOne(id: number): Promise<GuardadosEntity> {
    return await this.guardadosRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async getAll(user, options: IPaginationOptions): Promise<Pagination<GuardadosEntity>> {
    const find = await this.guardadosRP.createQueryBuilder('guar')
      .leftJoinAndSelect("guar.user", "users")
      .leftJoinAndSelect("guar.publicacion", "publicaciones")
      .leftJoinAndSelect("publicaciones.ccomercial", "ccomerciales")
      .leftJoinAndSelect("publicaciones.tienda", "tiendas")
      .where("guar.user = :user", { user })
      .orderBy('guar.id', 'DESC')

    if (isEmptyUndefined(find)) return null
    return paginate<GuardadosEntity>(find, options);
  }

}
