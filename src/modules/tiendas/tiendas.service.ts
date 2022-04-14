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
  GetAllxAtributoDto,
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

  async buscador(dto) {
    let search = {}
    if (!isEmptyUndefined(dto.ccomercial)) search['ccomercial'] = dto.ccomercial
    if (!isEmptyUndefined(dto.categoria)) search['categoria'] = dto.categoria
    if (!isEmptyUndefined(dto.isGastro)) search['isGastro'] = dto.isGastro
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    return search
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<TiendasEntity>> {
    return paginate<TiendasEntity>(this.tiendasRP, options, {
      relations: this.relations,
      order: { 'id': 'DESC' },
    });
  }

  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<TiendasEntity[]> {
    const find = await this.tiendasRP.find({
      where: await this.buscador(dto),
      relations: this.relations,
      order: { 'nombre': 'ASC' },
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<TiendasEntity> {
    return await this.tiendasRP.findOne({
      where: { id },
      relations: this.relations
    });
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

  async actualizarAbierto(dto: GetAllxAtributoDto): Promise<TiendasEntity> {
    await this.tiendasRP.update(dto.id, {
      abierto: dto.abierto
    });
    return await this.getOne(dto.id);
  }

}
