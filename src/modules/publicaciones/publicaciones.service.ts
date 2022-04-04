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
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateImageDto,
  CreatePublicacionesDto,
  UpdateImageDto,
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
    return paginate<PublicacionesEntity>(this.publicacionesRP, options, {
      relations: this.relations,
      order: { 'id': 'DESC' },
    });
  }

  async buscador(dto) {
    let search = {}
    if (!isEmptyUndefined(dto.ccomercial)) search['ccomercial'] = dto.ccomercial
    if (!isEmptyUndefined(dto.categoria)) search['categoria'] = dto.categoria
    if (!isEmptyUndefined(dto.tienda)) {
      search['tienda'] = dto.tienda === 0 ? null : dto.tienda
    }
    if (!isEmptyUndefined(dto.userEditor)) search['userEditor'] = dto.userEditor
    if (!isEmptyUndefined(dto.tipoPub)) search['tipoPub'] = dto.tipoPub
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status

    return search
  }

  async getAllxAtributo(dto, options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    return paginate<PublicacionesEntity>(this.publicacionesRP, options, {
      where: await this.buscador(dto),
      relations: this.relations,
      order: { 'id': 'DESC' },
    });
  }

  async getAllPublico(dto, options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    let where = await this.buscador(dto)
    where['status'] = true
    return paginate<PublicacionesEntity>(this.publicacionesRP, options, {
      where,
      relations: this.relations,
      order: { 'createdAt': 'DESC' },
    });
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

  async createImage(file: any, dto: CreateImageDto) {
    const dato = await this.getOne(parseInt(dto.publicacion));
    let galeria = dato.galeria
    let image
    try {
      image = await this.uploadImageToCloudinary(file)
      this.galeriaRP.createQueryBuilder()
        .insert()
        .into(GaleriaEntity)
        .values({
          entidad: dto.entidad,
          entId: parseInt(dto.entId),
          titular: 'publicacion',
          refId: parseInt(dto.publicacion),
          file: image.url
        })
        .execute();
    } catch (error) {
      image = { url: '' }
    }

    if (isEmptyUndefined(dto.index)) {
      await this.publicacionesRP.createQueryBuilder()
        .update(PublicacionesEntity)
        .set({ imageUrl: image.url })
        .where("id = :id", { id: parseInt(dto.publicacion) })
        .execute();
      return await this.getOne(parseInt(dto.publicacion));
    }

    for (let x = 0; x < 9; x++) {
      if (x == parseInt(dto.index)) {
        galeria[x] = image.url
      }
      if (isEmptyUndefined(galeria[x])) {
        galeria[x] = ""
      }
    }

    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ galeria: galeria })
      .where("id = :id", { id: parseInt(dto.publicacion) })
      .execute();
    return await this.getOne(parseInt(dto.publicacion));
  }

  async updateImage(dto: UpdateImageDto) {
    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ imageUrl: dto.url })
      .where("id = :id", { id: dto.publicacion })
      .execute();
    return await this.getOne(dto.publicacion);
  }

  async deleteGaleria(dto: CreateImageDto) {
    const data = await this.getOne(parseInt(dto.publicacion));
    data.galeria[parseInt(dto.index)] = ""
    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ galeria: data.galeria })
      .where("id = :id", { id: parseInt(dto.publicacion) })
      .execute();
    return await this.getOne(parseInt(dto.publicacion));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const data = await this.getOne(dto.publicacion);
    data.galeria[dto.index] = dto.url
    await this.publicacionesRP.createQueryBuilder()
      .update(PublicacionesEntity)
      .set({ galeria: data.galeria })
      .where("id = :id", { id: dto.publicacion })
      .execute();
    return await this.getOne(dto.publicacion);
  }

}
