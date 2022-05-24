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
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
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
    private galeriaService: GaleriaService,

    @InjectRepository(PublicacionesEntity)
    private readonly publicacionesRP: Repository<PublicacionesEntity>,

    @InjectRepository(PublicacionesGaleriaEntity)
    private readonly publicacionesGaleriaRP: Repository<PublicacionesGaleriaEntity>,

  ) { }

  async create(dto: CreatePublicacionesDto, userLogin: UsuariosEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.publicacionesRP.save({
      ...dto,
      tiendaCC: dto.tienda,
      cineCC: dto.cine,
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
      .leftJoinAndSelect("pub.usuarioEditor", "usuEdit")
      .leftJoinAndSelect("pub.ccomercial", "cc")
      .leftJoinAndSelect("pub.tiendaCC", "tieCC")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieImgGal")
      .leftJoinAndSelect("tie.imageBack", "tieImgBackGal")
      .leftJoinAndSelect("pub.cineCC", "cinCC")
      .leftJoinAndSelect("cinCC.cine", "cin")
      .leftJoinAndSelect("cin.image", "cinImgGal")
      .leftJoinAndSelect("cin.imageBack", "cinImgBackGal")
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
        'tieCC.id',
        'tie.id',
        'tie.nombre',
        'usuEdit.id',
        'usuEdit.nombre',
        'usuEdit.apellido',
        'tieImgGal.id',
        'tieImgGal.file',
        'tieImgBackGal.id',
        'tieImgBackGal.file',
      ])
      .loadRelationCountAndMap('pub.totalLikes', 'pub.likes')
      .loadRelationCountAndMap('pub.totalComentarios', 'pub.comentarios')

    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('pub.categoria = :categoria', { categoria: dto.categoria })
    }
    if (!isEmptyUndefined(dto.tipoPub)) {
      query.andWhere('pub.tipoPub = :tipoPub', { tipoPub: dto.tipoPub })
    }
    if (!isEmptyUndefined(dto.userEditor)) {
      query.andWhere('pub.usuarioEditor = :usuarioEditor', { userEditor: dto.userEditor })
    }
    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('pub.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('pub.ccomercial = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.tienda) && dto.tienda !== 0) {
      query.andWhere('pub.tiendaCC = :tienda', { tienda: dto.tienda })
    }
    if (!isEmptyUndefined(dto.cine) && dto.cine !== 0) {
      query.andWhere('pub.cineCC = :cine', { cine: dto.cine })
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
      .leftJoinAndSelect("pub.usuarioEditor", "usuEdit")
      .leftJoinAndSelect("pub.image", "pubGal")
      .leftJoinAndSelect("pub.tiendaCC", "tieCC")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieImgGal")
      .leftJoinAndSelect("tie.imageBack", "tieImgBackGal")
      .leftJoinAndSelect("pub.cineCC", "cinCC")
      .leftJoinAndSelect("cinCC.cine", "cine")
      .leftJoinAndSelect("cine.image", "cineImgGal")
      .leftJoinAndSelect("cine.imageBack", "cineImgBackGal")
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
        'tPub.id',
        'tPub.nombre',
        'tieCC.id',
        'tie.id',
        'tie.nombre',
        'tieImgGal.id',
        'tieImgGal.file',
        'tieImgBackGal.id',
        'tieImgBackGal.file',
        'cinCC.id',
        'cine.id',
        'cine.nombre',
        'cineImgGal.id',
        'cineImgGal.file',
        'cineImgBackGal.id',
        'cineImgBackGal.file',
        'usuEdit.id',
        'usuEdit.nombre',
        'usuEdit.apellido',
      ])
      .loadRelationCountAndMap('pub.totalLikes', 'pub.likes')
      .loadRelationCountAndMap('pub.totalComentarios', 'pub.comentarios')

    query.where('pub.status = :status', { status: true })

    if (!isEmptyUndefined(dto.tipoPub)) {
      query.andWhere('pub.tipoPub = :tipoPub', { tipoPub: dto.tipoPub })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('pub.ccomercial = :ccomercial', { ccomercial: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('pub.categoria = :categoria', { categoria: dto.categoria })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      query.andWhere('pub.tiendaCC = :tienda', { tienda: dto.tienda })
    }
    if (!isEmptyUndefined(dto.cine)) {
      query.andWhere('pub.cineCC = :cine', { cine: dto.cine })
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
      .leftJoinAndSelect("pub.usuarioEditor", "usuEdit")
      .leftJoinAndSelect("pub.image", "pubGal")
      .leftJoinAndSelect("pub.tiendaCC", "tieCC")
      .leftJoinAndSelect("tieCC.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieImgGal")
      .leftJoinAndSelect("tie.imageBack", "tieImgBackGal")
      .leftJoinAndSelect("pub.cineCC", "cinCC")
      .leftJoinAndSelect("cinCC.cine", "cine")
      .leftJoinAndSelect("cine.image", "cineImgGal")
      .leftJoinAndSelect("cine.imageBack", "cineImgBackGal")
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
        'tieCC.id',
        'tie.id',
        'tie.nombre',
        'tieImgGal.id',
        'tieImgGal.file',
        'tieImgBackGal.id',
        'tieImgBackGal.file',
        'cinCC.id',
        'cine.id',
        'cine.nombre',
        'cineImgGal.id',
        'cineImgGal.file',
        'cineImgBackGal.id',
        'cineImgBackGal.file',
        'usuEdit.id',
        'usuEdit.nombre',
        'usuEdit.apellido',
        'file.id',
        'file.index',
        'gal.id',
        'gal.file',
      ])
      .loadRelationCountAndMap('pub.totalLikes', 'pub.likes')
      .loadRelationCountAndMap('pub.totalComentarios', 'pub.comentarios')
      .where('pub.id = :id', { id })
      .getOne();

    if (isEmptyUndefined(getOne)) return null
    return getOne;
  }

  async update(dto: UpdatePublicacionesDto, userLogin: UsuariosEntity) {
    if (isEmptyUndefined(userLogin)) throw new NotFoundException(CONST.MESSAGES.COMMON.ERROR.ROLES);
    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)
    const assing = Object.assign(getOne, {
      ...dto,
      tiendaCC: dto.tienda,
      cineCC: dto.cine,
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

  async createImage(file: any, dto: CreateImageDto, userLogin: UsuariosEntity) {
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

      const findOne = await this.publicacionesGaleriaRP.findOne({
        where: {
          publicacion: dto.publicacion,
          index: dto.index,
        }
      })
      if (!isEmptyUndefined(findOne)) {
        await this.publicacionesGaleriaRP.update(findOne.id, {
          galeria: res.id
        });
      } else {
        await this.publicacionesGaleriaRP.save({
          publicacion: parseInt(dto.publicacion),
          index: parseInt(dto.index),
          galeria: res.id
        });
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
        publicacion: dto.publicacion,
        index: dto.index,
      }
    })
    if (!isEmptyUndefined(findOne)) {
      await this.publicacionesGaleriaRP.update(findOne.id, {
        galeria: dto.galeria,
      });
    } else {
      await this.publicacionesGaleriaRP.save({
        publicacion: dto.publicacion,
        index: dto.index,
        galeria: dto.galeria
      });
    }
    return await this.getOne(dto.publicacion);
  }

}
