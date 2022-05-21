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
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import {
  CreateComentariosDto,
  UpdateComentariosDto,
} from './dto';
import { ComentariosEntity } from './entities/comentarios.entity';

@Injectable()
export class ComentariosService {

  relations = [
    'publicacion'
  ]

  constructor(
    @InjectRepository(ComentariosEntity)
    private readonly comentariosRP: Repository<ComentariosEntity>,

  ) { }

  async create(dto: CreateComentariosDto, userLogin: UsuariosEntity) {
    const save = await this.comentariosRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });

    return await this.getOne(save.id);
  }

  async getAll(id, options: IPaginationOptions): Promise<Pagination<ComentariosEntity>> {
    const find = await this.comentariosRP.createQueryBuilder('com')
      .leftJoinAndSelect("com.user", "user")
      .leftJoinAndSelect("user.image", "iUrl")
      .select([
        'com.id',
        'com.comentario',
        'com.createdAt',
        'user.id',
        'user.nombre',
        'user.apellido',
        'iUrl.id',
        'iUrl.file',
      ])
      .where("com.publicacion = :id", { id })
      .orderBy('com.id', 'DESC')
    if (isEmptyUndefined(find)) return null
    return paginate<ComentariosEntity>(find, options);
  }

  async getOne(id: number): Promise<ComentariosEntity> {
    const getOne = await this.comentariosRP
      .createQueryBuilder("com")
      .leftJoinAndSelect("com.publicacion", "pub")
      .leftJoinAndSelect("pub.tipoPub", "tPub")
      .select([
        'com.id',
        'pub.id',
        'pub.nombre',
        'tPub.id',
        'tPub.nombre',
      ])
      .loadRelationCountAndMap('pub.totalComentarios', 'pub.comentarios')
      .where('com.id = :id', { id })
      .getOne()
    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdateComentariosDto, userLogin: UsuariosEntity) {
    if (isEmptyUndefined(userLogin)) throw new NotFoundException(CONST.MESSAGES.COMMON.ERROR.ROLES);
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    const assing = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    })
    const save = await this.comentariosRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);

    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.comentariosRP.delete(id);
    return await this.getOne(getOne.id);
  }

}
