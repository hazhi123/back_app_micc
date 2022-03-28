import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import {
  BadRequestException,
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
import { GaleriaEntity } from '../ccomerciales/entities/galeria.entity';

@Injectable()
export class PublicacionesService {

  relations = [
    'categoria',
    'tipoPub',
    'userEditor',
    'tienda',
    'tienda.categoria',
    'ccomercial',
    'ccomercial.pais',
  ]

  constructor(
    @InjectRepository(PublicacionesEntity)
    private readonly publicacionesRP: Repository<PublicacionesEntity>,

    @InjectRepository(GaleriaEntity)
    private readonly galeriaRP: Repository<GaleriaEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(dto: CreatePublicacionesDto, userLogin: UsersEntity) {
    await this.findNombre(dto.nombre, false)

    let galeria = []
    for (let x = 0; x < 9; x++) {
      galeria.push("")
    }

    const save = await this.publicacionesRP.save({
      ...dto,
      galeria,
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
      .leftJoinAndSelect("ccomerciales.pais", "paises")
      .leftJoinAndSelect("pub.tienda", "tiendas")
      .leftJoinAndSelect("pub.userEditor", "users")
      .orderBy('pub.id', 'DESC')

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
      order: { 'id': 'DESC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getAllPublico(dto, options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    let query = await this.publicacionesRP.createQueryBuilder('pub')
    query.leftJoinAndSelect("pub.categoria", "categorias")
      .leftJoinAndSelect("pub.tipoPub", "tipos_publicaciones")
      .leftJoinAndSelect("pub.ccomercial", "ccomerciales")
      .leftJoinAndSelect("ccomerciales.pais", "paises")
      .leftJoinAndSelect("pub.tienda", "tiendas")
      .leftJoinAndSelect("pub.userEditor", "users")
      .where("pub.status = :status", { status: true })
      .andWhere("pub.ccomercial = :ccomercial", { ccomercial: dto.ccomercial })
      .andWhere("pub.tipoPub = :tipo", { tipo: dto.tipoPub })
      .orderBy('pub.createdAt', 'DESC')
    if (!isEmptyUndefined(dto.categoria)) query.andWhere("pub.categoria = :categoria", { categoria: dto.categoria })
    const find = query
    if (isEmptyUndefined(find)) return null
    return paginate<PublicacionesEntity>(find, options);
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

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async createImage(file: any, id: number, index: number,) {
    const dato = await this.getOne(id);
    let galeria = dato.galeria
    let image
    try {
      image = await this.uploadImageToCloudinary(file)
      this.galeriaRP.createQueryBuilder()
        .insert()
        .into(GaleriaEntity)
        .values({
          titular: 'publicacion',
          refId: id,
          file: image.url
        })
        .execute();
    } catch (error) {
      image = { url: '' }
    }

    if (index === null) {
      await this.publicacionesRP.createQueryBuilder()
        .update(PublicacionesEntity)
        .set({ imageUrl: image.url })
        .where("id = :id", { id })
        .execute();
      return await this.getOne(id);
    }

    for (let x = 0; x < 9; x++) {
      if (x == index) {
        galeria[x] = image.url
      }
      if (isEmptyUndefined(galeria[x])) {
        galeria[x] = ""
      }
    }

    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ galeria: galeria })
      .where("id = :id", { id })
      .execute();

    return await this.getOne(id);

  }

  async createImageDel(id: number, index: number,) {
    const data = await this.getOne(id);
    data.galeria[index] = ""
    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ galeria: data.galeria })
      .where("id = :id", { id })
      .execute();
    return await this.getOne(id);
  }

}
