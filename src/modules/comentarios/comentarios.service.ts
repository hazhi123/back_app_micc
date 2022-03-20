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

import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateComentariosDto,
  UpdateComentariosDto,
} from './dto';
import { ComentariosEntity } from './entities/comentarios.entity';

@Injectable()
export class ComentariosService {

  relations = []

  constructor(
    @InjectRepository(ComentariosEntity)
    private readonly comentariosRP: Repository<ComentariosEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(dto: CreateComentariosDto, userLogin: UsersEntity) {
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

  async getAll(options: IPaginationOptions): Promise<Pagination<ComentariosEntity>> {
    const find = await this.comentariosRP.createQueryBuilder()
    if (isEmptyUndefined(find)) return null
    return paginate<ComentariosEntity>(find, options);
  }

  async getOne(id: number): Promise<ComentariosEntity> {
    return await this.comentariosRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdateComentariosDto, userLogin: UsersEntity) {
    if (isEmptyUndefined(userLogin)) throw new NotFoundException(CONST.MESSAGES.COMMON.ERROR.ROLES);
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    const assing = Object.assign(getOne, {
      ...getOne,
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
    return getOne;
  }

}
