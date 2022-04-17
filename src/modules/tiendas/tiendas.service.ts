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
import {
  CComercialesEntity,
} from '../ccomerciales/entities/ccomerciales.entity';
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { LicenciasEntity } from '../licencias/entities/licencias.entity';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateImageDto,
  CreateTiendasDto,
  GetAllDto,
  UpdateImageDto,
  UpdateTiendasDto,
} from './dto';
import { TiendasEntity } from './entities/tiendas.entity';

@Injectable()
export class TiendasService {

  relations = [
    'categoria',
    'ccomercial',
    'ccomercial.pais',
    'horarios',
  ]

  constructor(
    @InjectRepository(TiendasEntity)
    private readonly tiendasRP: Repository<TiendasEntity>,

    @InjectRepository(CComercialesEntity)
    private readonly ccomercialesRP: Repository<CComercialesEntity>,

    @InjectRepository(LicenciasEntity)
    private readonly licenciasRP: Repository<LicenciasEntity>,

    @InjectRepository(GaleriaEntity)
    private readonly galeriaRP: Repository<GaleriaEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(dto: CreateTiendasDto, userLogin: UsersEntity) {
    let galeria = []
    for (let x = 0; x < 9; x++) {
      galeria.push("")
    }

    const save = await this.tiendasRP.save({
      ...dto,
      galeria,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });

    const ccomercial = await this.ccomercialesRP.findOne({
      where: { id: dto.ccomercial }
    })

    await this.ccomercialesRP.update(dto.ccomercial, {
      totalTiendas: ccomercial.totalTiendas + 1
    });

    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<TiendasEntity>> {
    const query = await this.tiendasRP
      .createQueryBuilder("ti")
    query
      .leftJoinAndSelect("ti.ccomercial", "cc")
      .leftJoinAndSelect("ti.categoria", "cat")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.correo',
        'ti.telPrimero',
        'ti.ubicacion',
        'ti.likes',
        'ti.isGastro',
        'ti.imageUrl',
        'ti.status',
        'ti.abierto',
        'cc.id',
        'cc.nombre',
        'cat.id',
        'cat.nombre',
      ])

    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccId', { ccId: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :catId', { catId: dto.categoria })
    }
    if (!isEmptyUndefined(dto.isGastro)) {
      query.andWhere('ti.isGastro = :isGastro', { isGastro: dto.isGastro })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('ti.status = :status', { status: dto.status })
    }
    query.addOrderBy("ti.nombre", "ASC")

    query.getMany();
    return paginate<TiendasEntity>(query, options);
  }

  async getAllPublico(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<TiendasEntity>> {
    const query = await this.tiendasRP
      .createQueryBuilder("ti")
    query
      .leftJoinAndSelect("ti.ccomercial", "cc")
      .leftJoinAndSelect("ti.categoria", "cat")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.ubicacion',
        'ti.isGastro',
        'ti.imageUrl',
        'ti.abierto',
        'cat.id',
        'cat.nombre',
      ])
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccId', { ccId: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :catId', { catId: dto.categoria })
    }
    if (!isEmptyUndefined(dto.isGastro)) {
      query.andWhere('ti.isGastro = :isGastro', { isGastro: dto.isGastro })
    }
    query.andWhere('ti.status = :status', { status: true })
    query.addOrderBy("ti.nombre", "ASC")

    query.getMany();
    return paginate<TiendasEntity>(query, options);
  }

  async getOne(id: number): Promise<TiendasEntity> {
    const getOne = await this.tiendasRP
      .createQueryBuilder("ti")
      .leftJoinAndSelect("ti.horarios", "hor")
      .leftJoinAndSelect("ti.categoria", "cat")
      .select([
        'ti.id',
        'ti.nombre',
        'ti.correo',
        'ti.telPrimero',
        'ti.telSegundo',
        'ti.ubicacion',
        'ti.likes',
        'ti.desc',
        'ti.createdBy',
        'ti.createdAt',
        'ti.updatedBy',
        'ti.updatedAt',
        'ti.status',
        'ti.abierto',
        'ti.isGastro',
        'ti.imageUrl',
        'ti.galeria',
        'hor.id',
        'hor.lunes',
        'hor.martes',
        'hor.miercoles',
        'hor.jueves',
        'hor.viernes',
        'hor.sabado',
        'hor.domingo',
        'hor.feriados',
        'cat.id',
        'cat.nombre',
      ])
      .where('ti.id = :id', { id })
      .getOne()
    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdateTiendasDto, userLogin: UsersEntity) {
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
    const save = await this.tiendasRP.save(assing)
    return await this.getOne(save.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)

    const ccomercial = await this.ccomercialesRP.findOne({
      where: { id: getOne.ccomercial.id }
    })
    await this.ccomercialesRP.update(getOne.ccomercial.id, {
      totalTiendas: ccomercial.totalTiendas - 1
    });
    await this.tiendasRP.delete(id);

    return getOne;
  }


  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.tiendasRP.findOne({ where: { nombre } })
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
    const dato = await this.getOne(parseInt(dto.tienda));
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
          titular: 'tienda',
          refId: parseInt(dto.tienda),
          file: image.url
        })
        .execute();
    } catch (error) {
      image = { url: '' }
    }

    if (isEmptyUndefined(dto.index)) {
      await this.tiendasRP.update(parseInt(dto.tienda), {
        imageUrl: image.url
      });
      return await this.getOne(parseInt(dto.tienda));
    }

    for (let x = 0; x < 9; x++) {
      if (x == parseInt(dto.index)) {
        galeria[x] = image.url
      }
      if (isEmptyUndefined(galeria[x])) {
        galeria[x] = ""
      }
    }

    await this.tiendasRP.update(parseInt(dto.tienda), {
      galeria
    });
    return await this.getOne(parseInt(dto.tienda));

  }

  async updateImage(dto: UpdateImageDto) {
    await this.tiendasRP.update(dto.tienda, {
      imageUrl: dto.url
    });
    return await this.getOne(dto.tienda);
  }

  async deleteGaleria(dto: CreateImageDto) {
    const data = await this.getOne(parseInt(dto.tienda));
    data.galeria[parseInt(dto.index)] = ""
    await this.tiendasRP.update(dto.tienda, {
      galeria: data.galeria
    });
    return await this.getOne(parseInt(dto.tienda));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const data = await this.getOne(dto.tienda);
    data.galeria[dto.index] = dto.url
    await this.tiendasRP.update(dto.tienda, {
      galeria: data.galeria
    });
    return await this.getOne(dto.tienda);
  }

  async actualizarApertura(dto: GetAllDto): Promise<TiendasEntity> {
    await this.tiendasRP.update(dto.id, {
      abierto: dto.abierto
    });
    return;
  }

}
