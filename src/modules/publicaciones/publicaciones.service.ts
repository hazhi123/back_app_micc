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
  CreatePublicacionesDto,
  GetAllxAtributoDto,
  UpdatePublicacionesDto,
} from './dto';
import { PublicacionesEntity } from './entities/publicaciones.entity';

@Injectable()
export class PublicacionesService {

  relations = [
    'categoria',
    'tipoPub',
    'userEditor',
    'tienda',
    'ccomercial',
  ]

  constructor(
    @InjectRepository(PublicacionesEntity)
    private readonly publicacionesRP: Repository<PublicacionesEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(dto: CreatePublicacionesDto, userLogin: UsersEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.publicacionesRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });
    return await this.getOne(save.id);
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    const find = await this.publicacionesRP.createQueryBuilder('pub')
      .leftJoinAndSelect("pub.categoria", "categorias")
      .leftJoinAndSelect("pub.tipoPub", "tipos_publicaciones")
      .leftJoinAndSelect("pub.ccomercial", "ccomerciales")
      .leftJoinAndSelect("pub.tienda", "tiendas")
      .leftJoinAndSelect("pub.userEditor", "users")
      .orderBy('pub.createdAt', 'DESC')

    if (isEmptyUndefined(find)) return null
    return paginate<PublicacionesEntity>(find, options);
  }

  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<PublicacionesEntity[]> {
    let search = {}
    if (!isEmptyUndefined(dto.ccomercial)) search['ccomercial'] = dto.ccomercial
    if (!isEmptyUndefined(dto.categoria)) search['categoria'] = dto.categoria
    if (!isEmptyUndefined(dto.tienda)) search['tienda'] = dto.tienda
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    const find = await this.publicacionesRP.find({
      where: search,
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<PublicacionesEntity> {
    return await this.publicacionesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdatePublicacionesDto, userLogin: UsersEntity) {
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
    const save = await this.publicacionesRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.publicacionesRP.delete(id);
    return getOne;
  }


  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.publicacionesRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

}
