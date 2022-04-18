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
  GetAllDto,
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
    'ccomercial.ciudad',
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

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    const query = await this.publicacionesRP
      .createQueryBuilder("pub")
    query
      .leftJoinAndSelect("pub.categoria", "cat")
      .leftJoinAndSelect("pub.tipoPub", "tPub")
      .leftJoinAndSelect("pub.userEditor", "uEdit")
      .leftJoinAndSelect("pub.ccomercial", "cc")
      .leftJoinAndSelect("pub.tienda", "tie")
      .select([
        'pub.id',
        'pub.nombre',
        'pub.imageUrl',
        'pub.desc',
        'pub.isPermanente',
        'pub.fechaInicio',
        'pub.fechaFinal',
        'pub.status',
        'pub.totalLikes',
        'pub.totalComentarios',
        'pub.galeria',
        'pub.linkRef',
        'pub.createdAt',
        'tPub.id',
        'tPub.nombre',
        'cc.id',
        'cc.nombre',
        'tie.id',
        'tie.nombre',
        'uEdit.id',
        'uEdit.nombre',
        'uEdit.apellido',
      ])

    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :catId', { catId: dto.categoria })
    }
    if (!isEmptyUndefined(dto.tipoPub)) {
      query.andWhere('tPub.id = :tPubId', { tPubId: dto.tipoPub })
    }
    if (!isEmptyUndefined(dto.userEditor)) {
      query.andWhere('uEdit.id = :uEditId', { uEditId: dto.userEditor })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('pub.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccId', { ccId: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.tienda) && dto.tienda !== 0) {
      query.andWhere('tie.id = :tieId', { tieId: dto.tienda })
    }
    query.orderBy("pub.id", "DESC")
    query.getMany();
    return paginate<PublicacionesEntity>(query, options);

  }

  async getAllPublico(dto, options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    const query = await this.publicacionesRP
      .createQueryBuilder("pub")
    query
      .leftJoinAndSelect("pub.categoria", "cat")
      .leftJoinAndSelect("pub.tipoPub", "tPub")
      .leftJoinAndSelect("pub.ccomercial", "cc")
      .leftJoinAndSelect("pub.tienda", "tie")
      .select([
        'pub.id',
        'pub.nombre',
        'pub.imageUrl',
        'pub.desc',
        'pub.totalLikes',
        'pub.totalComentarios',
        'pub.createdAt',
        'cc.id',
        'cc.nombre',
        'cc.image',
        'tie.id',
        'tie.nombre',
        'tie.imageUrl',
        'tPub.id',
        'tPub.nombre',
      ])
    query.where('tPub.id = :tPubId', { tPubId: dto.tipoPub })
    query.andWhere('cc.id = :ccId', { ccId: dto.ccomercial })
    query.orderBy("pub.createdAt", "DESC")
    query.getMany();
    return paginate<PublicacionesEntity>(query, options);
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
          referencia: 'publicacion',
          refId: parseInt(dto.publicacion),
          file: image.url
        })
        .execute();
    } catch (error) {
      image = { url: '' }
    }

    if (isEmptyUndefined(dto.index)) {
      await this.publicacionesRP.update(parseInt(dto.publicacion), {
        imageUrl: image.url
      });
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
    await this.publicacionesRP.update(parseInt(dto.publicacion), {
      galeria
    });
    return await this.getOne(parseInt(dto.publicacion));
  }

  async updateImage(dto: UpdateImageDto) {
    await this.publicacionesRP.update(dto.publicacion, {
      imageUrl: dto.url
    });
    return await this.getOne(dto.publicacion);
  }

  async deleteGaleria(dto: CreateImageDto) {
    const data = await this.getOne(parseInt(dto.publicacion));
    data.galeria[parseInt(dto.index)] = ""
    await this.publicacionesRP.update(parseInt(dto.publicacion), {
      galeria: data.galeria
    });
    return await this.getOne(parseInt(dto.publicacion));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const data = await this.getOne(dto.publicacion);
    data.galeria[dto.index] = dto.url
    await this.publicacionesRP.update(dto.publicacion, {
      galeria: data.galeria
    });
    return await this.getOne(dto.publicacion);
  }

}
