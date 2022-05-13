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
import { GaleriaService } from '../galeria/galeria.service';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateImageDto,
  CreatePublicacionesDto,
  GetAllDto,
  UpdateImageDto,
  UpdatePublicacionesDto,
} from './dto';
import {
  PublicacionesGaleriaEntity,
} from './entities/publicaciones-galeria.entity';
import { PublicacionesEntity } from './entities/publicaciones.entity';

@Injectable()
export class PublicacionesService {

  constructor(
    @InjectRepository(PublicacionesEntity)
    private readonly publicacionesRP: Repository<PublicacionesEntity>,

    @InjectRepository(PublicacionesGaleriaEntity)
    private readonly publicacionesGaleriaRP: Repository<PublicacionesGaleriaEntity>,

    private galeriaService: GaleriaService,

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

  async getAll(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    const query = await this.publicacionesRP
      .createQueryBuilder("pub")
    query
      .leftJoinAndSelect("pub.categoria", "cat")
      .leftJoinAndSelect("pub.image", "pubGal")
      .leftJoinAndSelect("pub.tipoPub", "tPub")
      .leftJoinAndSelect("pub.userEditor", "uEdit")
      .leftJoinAndSelect("pub.ccomercial", "cc")
      .leftJoinAndSelect("pub.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieImgGal")
      .leftJoinAndSelect("tie.imageBack", "tieImgBackGal")
      .select([
        'pub.id',
        'pub.nombre',
        'pub.desc',
        'pub.isPermanente',
        'pub.fechaInicio',
        'pub.fechaFinal',
        'pub.status',
        'pub.linkRef',
        'pub.createdAt',
        'pubGal.id',
        'pubGal.file',
        'tPub.id',
        'tPub.nombre',
        'cc.id',
        'cc.nombre',
        'cat.id',
        'cat.nombre',
        'tie.id',
        'tie.nombre',
        'uEdit.id',
        'uEdit.nombre',
        'uEdit.apellido',
        'tieImgGal.id',
        'tieImgGal.file',
        'tieImgBackGal.id',
        'tieImgBackGal.file',
      ])
      .loadRelationCountAndMap('cc.totalLikes', 'pub.likes')
      .loadRelationCountAndMap('cc.totalComentarios', 'pub.comentarios')

    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :categoria', { categoria: dto.categoria })
    }
    if (!isEmptyUndefined(dto.tipoPub)) {
      query.andWhere('tPub.id = :tipoPub', { tipoPub: dto.tipoPub })
    }
    if (!isEmptyUndefined(dto.userEditor)) {
      query.andWhere('uEdit.id = :userEditor', { userEditor: dto.userEditor })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('pub.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.tienda) && dto.tienda !== 0) {
      query.andWhere('tie.id = :tienda', { tienda: dto.tienda })
    }
    query.orderBy("pub.id", "DESC")
    query.getMany();
    return paginate<PublicacionesEntity>(query, options);
  }

  async getAllPublico(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    const query = await this.publicacionesRP
      .createQueryBuilder("pub")
    query
      .leftJoinAndSelect("pub.categoria", "cat")
      .leftJoinAndSelect("pub.tipoPub", "tPub")
      .leftJoinAndSelect("pub.ccomercial", "cc")
      .leftJoinAndSelect("cc.image", "ccGal")
      .leftJoinAndSelect("pub.userEditor", "uEdit")
      .leftJoinAndSelect("pub.image", "pubGal")
      .leftJoinAndSelect("pub.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieImgGal")
      .leftJoinAndSelect("tie.imageBack", "tieImgBackGal")
      .select([
        'pub.id',
        'pub.nombre',
        'pub.desc',
        'pub.createdAt',
        'pubGal.id',
        'pubGal.file',
        'cc.id',
        'cc.nombre',
        'ccGal.id',
        'ccGal.file',
        'tie.id',
        'tie.nombre',
        'tPub.id',
        'tPub.nombre',
        'tieImgGal.id',
        'tieImgGal.file',
        'tieImgBackGal.id',
        'tieImgBackGal.file',
        'uEdit.id',
        'uEdit.nombre',
        'uEdit.apellido',
      ])
      .loadRelationCountAndMap('cc.totalLikes', 'pub.likes')
      .loadRelationCountAndMap('cc.totalComentarios', 'pub.comentarios')

    query.where('pub.status = :status', { status: true })

    if (!isEmptyUndefined(dto.tipoPub)) {
      query.andWhere('tPub.id = :tipoPub', { tipoPub: dto.tipoPub })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :categoria', { categoria: dto.categoria })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      query.andWhere('tie.id = :tienda', { tienda: dto.tienda })
    }
    query.orderBy("pub.createdAt", "DESC")
    query.getMany();
    return paginate<PublicacionesEntity>(query, options);
  }

  async getOne(id: number): Promise<PublicacionesEntity> {
    const getOne = await this.publicacionesRP
      .createQueryBuilder("pub")
      .leftJoinAndSelect("pub.categoria", "cat")
      .leftJoinAndSelect("pub.tipoPub", "tPub")
      .leftJoinAndSelect("pub.ccomercial", "cc")
      .leftJoinAndSelect("cc.image", "ccGal")
      .leftJoinAndSelect("pub.userEditor", "uEdit")
      .leftJoinAndSelect("pub.image", "pubGal")
      .leftJoinAndSelect("pub.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieImgGal")
      .leftJoinAndSelect("tie.imageBack", "tieImgBackGal")
      .leftJoinAndSelect("pub.files", "file")
      .leftJoinAndSelect("file.galeria", "gal")
      .select([
        'pub.id',
        'pub.nombre',
        'pub.desc',
        'pub.isPermanente',
        'pub.fechaInicio',
        'pub.fechaFinal',
        'pub.createdAt',
        'pub.updatedAt',
        'pub.status',
        'pub.linkRef',
        'pubGal.id',
        'pubGal.file',
        'cat.id',
        'cat.nombre',
        'tPub.id',
        'tPub.nombre',
        'cc.id',
        'cc.nombre',
        'ccGal.id',
        'ccGal.file',
        'tie.id',
        'tie.nombre',
        'tieImgGal.id',
        'tieImgGal.file',
        'tieImgBackGal.id',
        'tieImgBackGal.file',
        'uEdit.id',
        'uEdit.nombre',
        'uEdit.apellido',
        'file.id',
        'file.index',
        'gal.id',
        'gal.file',
      ])
      .loadRelationCountAndMap('cc.totalLikes', 'pub.likes')
      .loadRelationCountAndMap('cc.totalComentarios', 'pub.comentarios')
      .where('pub.id = :id', { id })
      .getOne();

    if (isEmptyUndefined(getOne)) return null
    return getOne;
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
    // await this.publicacionesRP.delete(id);
    await this.publicacionesRP.update(id, { status: false });
    return await this.getOne(id);
  }


  async findNombre(nombre: string, data: boolean) {
    const findOne = await this.publicacionesRP.findOne({ where: { nombre } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {
    if (dto.index === undefined || dto.index === '') {
      try {
        const data = {
          entidad: dto.entidad,
          entId: parseInt(dto.entId),
          referencia: 'publicacion',
          refId: parseInt(dto.publicacion),
        }
        const res = await this.galeriaService.create(file, data, userLogin)
        await this.publicacionesRP.update(parseInt(dto.publicacion), {
          image: res.id
        });
        return res;
      } catch (error) {
        throw new HttpException({
          statusCode: HttpStatus.ACCEPTED,
          message: 'Error al registrar la imagen',
        }, HttpStatus.ACCEPTED)
      }
    }

    try {
      const data = {
        entidad: dto.entidad,
        entId: parseInt(dto.entId),
        referencia: 'publicacion',
        refId: parseInt(dto.publicacion),
      }
      const res = await this.galeriaService.create(file, data, userLogin)

      if (isEmptyUndefined(dto.vieja)) {
        await this.publicacionesGaleriaRP.save({
          index: parseInt(dto.index),
          publicacion: parseInt(dto.publicacion),
          galeria: res.id
        });
      } else {
        const findOne = await this.publicacionesGaleriaRP.findOne({
          where: {
            galeria: dto.vieja,
            publicacion: dto.publicacion,
          }
        })
        if (!isEmptyUndefined(findOne)) {
          await this.publicacionesGaleriaRP.update(findOne.id, {
            galeria: res.id
          });
        } else {
          await this.publicacionesGaleriaRP.save({
            index: parseInt(dto.index),
            publicacion: parseInt(dto.publicacion),
            galeria: res.id
          });
        }

      }

      return await this.getOne(parseInt(dto.publicacion));

    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.ACCEPTED,
        message: 'Error al registrar la imagen',
      }, HttpStatus.ACCEPTED)
    }

  }

  async updateImage(dto: UpdateImageDto) {
    await this.publicacionesRP.update(dto.publicacion, {
      image: dto.galeria
    });
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async deleteGaleria(dto: CreateImageDto) {
    await this.publicacionesGaleriaRP.delete(parseInt(dto.file));
    return await this.getOne(parseInt(dto.publicacion));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const findOne = await this.publicacionesGaleriaRP.findOne({
      where: {
        galeria: dto.vieja,
        publicacion: dto.publicacion,
      }
    })
    if (!isEmptyUndefined(findOne)) {
      await this.publicacionesGaleriaRP.update(findOne.id, {
        galeria: dto.galeria,
      });
    } else {
      await this.publicacionesGaleriaRP.save({
        index: dto.index,
        publicacion: dto.publicacion,
        galeria: dto.galeria
      });
    }
    return await this.getOne(dto.publicacion);
  }

}
