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
import { LicenciasEntity } from '../licencias/entities/licencias.entity';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateTiendasDto,
  GetAllxAtributoDto,
  UpdateTiendasDto,
} from './dto';
import { TiendasEntity } from './entities/tiendas.entity';
import { GaleriaEntity } from '../ccomerciales/entities/galeria.entity';
import { CComercialesEntity } from '../ccomerciales/entities/ccomerciales.entity';

@Injectable()
export class TiendasService {

  relations = [
    'categoria',
    'ccomercial',
    'ccomercial.pais',
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

    await this.ccomercialesRP.createQueryBuilder()
      .update(CComercialesEntity)
      .set({ totalTiendas: ccomercial.totalTiendas + 1 })
      .where("id = :id", { id: dto.ccomercial })
      .execute();

    // await createLicenciasFree(this.licenciasRP, this.usersRP, { userId: dto.user, userLoginId: userLogin.id })
    return await this.getOne(save.id);
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<TiendasEntity>> {
    const find = await this.tiendasRP.createQueryBuilder('tiendas')
      .leftJoinAndSelect("tiendas.categoria", "categorias")
      .leftJoinAndSelect("tiendas.ccomercial", "ccomerciales")
      .leftJoinAndSelect("ccomerciales.pais", "paises")
      .orderBy('tiendas.nombre', 'ASC')

    if (isEmptyUndefined(find)) return null
    return paginate<TiendasEntity>(find, options);
  }

  async getAllxAtributo(dto: GetAllxAtributoDto): Promise<TiendasEntity[]> {
    let search = {}
    if (!isEmptyUndefined(dto.ccomercial)) search['ccomercial'] = dto.ccomercial
    if (!isEmptyUndefined(dto.categoria)) search['categoria'] = dto.categoria
    if (!isEmptyUndefined(dto.status)) search['status'] = dto.status
    const find = await this.tiendasRP.find({
      where: search,
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
      ...getOne,
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

    await this.ccomercialesRP.createQueryBuilder()
      .update(CComercialesEntity)
      .set({ totalTiendas: ccomercial.totalTiendas - 1 })
      .where("id = :id", { id: getOne.ccomercial.id })
      .execute();

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
          titular: 'tienda',
          refId: id,
          file: image.url
        })
        .execute();
    } catch (error) {
      image = { url: '' }
    }

    if (index === null) {
      await this.tiendasRP.createQueryBuilder()
        .update(TiendasEntity)
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

    await this.tiendasRP.createQueryBuilder()
      .update(TiendasEntity)
      .set({ galeria: galeria })
      .where("id = :id", { id })
      .execute();

    return await this.getOne(id);

  }

  async createImageDel(id: number, index: number,) {
    const data = await this.getOne(id);
    data.galeria[index] = ""
    await this.tiendasRP.createQueryBuilder()
      .update(TiendasEntity)
      .set({ galeria: data.galeria })
      .where("id = :id", { id })
      .execute();
    return await this.getOne(id);
  }

}
