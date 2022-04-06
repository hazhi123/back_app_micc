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
  CreateCComercialesDto,
  CreateImageDto,
  GetAllxAtributoDto,
  UpdateCComercialesDto,
  UpdateImageDto,
} from './dto';
import { CComercialesEntity } from './entities/ccomerciales.entity';

@Injectable()
export class CComercialesService {

  relations = [
    'pais',
    'ciudad'
  ]

  constructor(
    @InjectRepository(CComercialesEntity)
    private readonly ccomercialesRP: Repository<CComercialesEntity>,

    @InjectRepository(GaleriaEntity)
    private readonly galeriaRP: Repository<GaleriaEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(dto: CreateCComercialesDto, userLogin: UsersEntity) {
    let galeria = []
    for (let x = 0; x < 9; x++) {
      galeria.push("")
    }

    const save = await this.ccomercialesRP.save({
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

  async getAll(options: IPaginationOptions): Promise<Pagination<CComercialesEntity>> {
    return paginate<CComercialesEntity>(this.ccomercialesRP, options, {
      relations: ['pais', 'ciudad', 'tiendas'],
      order: { 'nombre': 'ASC' },
    });
  }

  async buscador(dto) {
    let search = {}
    if (!isEmptyUndefined(dto.pais)) search['pais'] = dto.pais
    if (!isEmptyUndefined(dto.ciudad)) search['ciudad'] = dto.ciudad
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    return search
  }

  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<CComercialesEntity[]> {
    const find = await this.ccomercialesRP.find({
      where: await this.buscador(dto),
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<CComercialesEntity> {
    return await this.ccomercialesRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

  async update(dto: UpdateCComercialesDto, userLogin: UsersEntity) {
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
    const save = await this.ccomercialesRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.ccomercialesRP.delete(id);
    return getOne;
  }


  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.ccomercialesRP.findOne({ where: { nombre } })
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
    const dato = await this.getOne(parseInt(dto.ccomercial));
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
          titular: 'ccomercial',
          refId: parseInt(dto.ccomercial),
          file: image.url
        })
        .execute();
    } catch (error) {
      image = { url: '' }
    }

    if (isEmptyUndefined(dto.index)) {
      await this.ccomercialesRP.createQueryBuilder()
        .update(CComercialesEntity)
        .set({ imageUrl: image.url })
        .where("id = :id", { id: parseInt(dto.ccomercial) })
        .execute();
      return await this.getOne(parseInt(dto.ccomercial));
    }

    for (let x = 0; x < 9; x++) {
      if (x == parseInt(dto.index)) {
        galeria[x] = image.url
      }
      if (isEmptyUndefined(galeria[x])) {
        galeria[x] = ""
      }
    }

    await this.ccomercialesRP.createQueryBuilder()
      .update(CComercialesEntity)
      .set({ galeria: galeria })
      .where("id = :id", { id: parseInt(dto.ccomercial) })
      .execute();

    return await this.getOne(parseInt(dto.ccomercial));

  }

  async updateImage(dto: UpdateImageDto) {
    await this.ccomercialesRP.createQueryBuilder()
      .update(CComercialesEntity)
      .set({ imageUrl: dto.url })
      .where("id = :id", { id: dto.ccomercial })
      .execute();
    return await this.getOne(dto.ccomercial);
  }

  async deleteGaleria(dto: CreateImageDto) {
    const data = await this.getOne(parseInt(dto.ccomercial));
    data.galeria[parseInt(dto.index)] = ""
    await this.ccomercialesRP.createQueryBuilder()
      .update(CComercialesEntity)
      .set({ galeria: data.galeria })
      .where("id = :id", { id: parseInt(dto.ccomercial) })
      .execute();
    return await this.getOne(parseInt(dto.ccomercial));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const data = await this.getOne(dto.ccomercial);
    data.galeria[dto.index] = dto.url
    await this.ccomercialesRP.createQueryBuilder()
      .update(CComercialesEntity)
      .set({ galeria: data.galeria })
      .where("id = :id", { id: dto.ccomercial })
      .execute();
    return await this.getOne(dto.ccomercial);
  }



}
