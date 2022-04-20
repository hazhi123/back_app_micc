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
import {
  PublicacionesEntity,
} from '../publicaciones/entities/publicaciones.entity';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateLikesDto,
  GetAllDto,
  UpdateLikesDto,
} from './dto';
import { LikesEntity } from './entities/likes.entity';

@Injectable()
export class LikesService {

  constructor(
    @InjectRepository(LikesEntity)
    private readonly likesRP: Repository<LikesEntity>,

    @InjectRepository(PublicacionesEntity)
    private readonly publicacionesRP: Repository<PublicacionesEntity>,

  ) { }

  async create(dto: CreateLikesDto, userLogin: UsersEntity) {
    const existe = await this.existe(dto.user, dto.publicacion);
    if (!isEmptyUndefined(existe)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: 'Ya diste un like',
    }, HttpStatus.ACCEPTED)
    const save = await this.likesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });

    const pub = await this.publicacionesRP.findOne({
      where: { id: dto.publicacion },
    });

    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ totalLikes: pub.totalLikes + 1 })
      .where("id = :id", { id: dto.publicacion })
      .execute();

    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<LikesEntity>> {
    const query = await this.likesRP
      .createQueryBuilder("like")
    query
      .leftJoinAndSelect("like.user", "user")
      .leftJoinAndSelect("user.image", "userGal")
      .leftJoinAndSelect("like.publicacion", "pub")
      .select([
        'like.id',
        'user.nombre',
        'user.apellido',
        'userGal.id',
        'userGal.file',
      ])
    query.where('pub.id = :pubId', { pubId: dto.publicacion })
    query.orderBy("like.id", "DESC")
    query.getMany();
    return paginate<LikesEntity>(query, options);
  }

  async getOne(id: number): Promise<LikesEntity> {
    const getOne = await this.likesRP
      .createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .leftJoinAndSelect("like.publicacion", "pub")
      .select([
        'like.id',
        'pub.id',
        'pub.totalLikes',
      ])
      .where('like.id = :id', { id })
      .getOne()
    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdateLikesDto, userLogin: UsersEntity) {
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
    const save = await this.likesRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    const pub = await this.publicacionesRP.findOne({
      where: { id: getOne.publicacion.id },
    });

    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ totalLikes: pub.totalLikes - 1 })
      .where("id = :id", { id: getOne.publicacion.id })
      .execute();

    await this.likesRP.delete(id);
    return await this.getOne(getOne.id);
  }

  async existe(user, publicacion): Promise<LikesEntity> {
    return await this.likesRP.findOne({
      where: { user, publicacion },
    });
  }

}
