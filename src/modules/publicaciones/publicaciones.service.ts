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
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { GaleriaService } from '../galeria/galeria.service';
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
    'image',
    'tienda',
    'tienda.categoria',
    'tienda.image',
    'ccomercial',
    'ccomercial.image',
    'ccomercial.ciudad',
    'ccomercial.ciudad.estado',
    // 'ccomercial.ciudad.estado.pais',
  ]

  constructor(
    @InjectRepository(PublicacionesEntity)
    private readonly publicacionesRP: Repository<PublicacionesEntity>,

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
      .leftJoinAndSelect("tie.image", "tieGal")
      .select([
        'pub.id',
        'pub.nombre',
        'pub.desc',
        'pub.isPermanente',
        'pub.fechaInicio',
        'pub.fechaFinal',
        'pub.status',
        'pub.galeria',
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
        'tieGal.id',
        'tieGal.file',
      ])
      .loadRelationCountAndMap('cc.totalLikes', 'pub.likes')
      .loadRelationCountAndMap('cc.totalComentarios', 'pub.comentarios')

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

  async getAllPublico(dto: GetAllDto, options: IPaginationOptions): Promise<Pagination<PublicacionesEntity>> {
    const query = await this.publicacionesRP
      .createQueryBuilder("pub")
    query
      .leftJoinAndSelect("pub.categoria", "cat")
      .leftJoinAndSelect("pub.tipoPub", "tPub")
      .leftJoinAndSelect("pub.ccomercial", "cc")
      .leftJoinAndSelect("pub.userEditor", "uEdit")
      .leftJoinAndSelect("cc.image", "ccGal")
      .leftJoinAndSelect("pub.image", "pubGal")
      .leftJoinAndSelect("pub.tienda", "tie")
      .leftJoinAndSelect("tie.image", "tieGal")
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
        'tieGal.id',
        'tieGal.file',
        'uEdit.id',
        'uEdit.nombre',
        'uEdit.apellido',
      ])
      .loadRelationCountAndMap('cc.totalLikes', 'pub.likes')
      .loadRelationCountAndMap('cc.totalComentarios', 'pub.comentarios')

    if (!isEmptyUndefined(dto.tipoPub)) {
      query.andWhere('tPub.id = :id', { id: dto.tipoPub })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :id', { id: dto.ccomercial })
    }
    if (!isEmptyUndefined(dto.categoria)) {
      query.andWhere('cat.id = :id', { id: dto.categoria })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      query.andWhere('tie.id = :id', { id: dto.tienda })
    }
    query.andWhere('pub.status = :status', { status: true })
    query.orderBy("pub.createdAt", "DESC")
    query.getMany();
    return paginate<PublicacionesEntity>(query, options);
  }

  async getOne(id: number, isGaleria: boolean = true): Promise<PublicacionesEntity> {
    const getOne = await this.publicacionesRP.findOne({
      where: { id },
      relations: this.relations
    });

    if (isGaleria) {
      for (let x = 0; x < getOne.galeria.length; x++) {
        if (!isEmptyUndefined(getOne.galeria[x])) {
          getOne.galeria[x] = await this.galeriaService.getOne(parseInt(getOne.galeria[x]));
        }
      }
    }
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
    const dato = await this.getOne(parseInt(dto.publicacion), false);
    let galeria = dato.galeria
    let image

    if (isEmptyUndefined(dto.index)) {
      let galeriaId;
      let res: GaleriaEntity
      try {
        const data = {
          entidad: dto.entidad,
          entId: parseInt(dto.entId),
          referencia: 'publicacion',
          refId: parseInt(dto.publicacion),
        }
        res = await this.galeriaService.create(file, data, userLogin)
        galeriaId = res.id
      } catch (error) {
        galeriaId = null
        res = null
      }

      await this.publicacionesRP.update(parseInt(dto.publicacion), {
        image: galeriaId
      });
      return res;
    }

    let galeriaId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: dto.entidad,
        entId: parseInt(dto.entId),
        referencia: 'publicacion',
        refId: parseInt(dto.publicacion),
      }
      res = await this.galeriaService.create(file, data, userLogin)
      galeriaId = res.id
    } catch (error) {
      galeriaId = null
      res = null
    }

    for (let x = 0; x < 9; x++) {
      if (x == parseInt(dto.index)) {
        galeria[x] = galeriaId
      }
      if (isEmptyUndefined(galeria[x])) {
        galeria[x] = '0'
      }
    }
    await this.publicacionesRP.update(parseInt(dto.publicacion), {
      galeria
    });
    return await this.getOne(parseInt(dto.publicacion));
  }

  async updateImage(dto: UpdateImageDto) {
    await this.publicacionesRP.update(dto.publicacion, {
      image: dto.galeria
    });
    const getOneGaleria = await this.galeriaService.getOne(dto.galeria)
    return getOneGaleria;
  }

  async deleteGaleria(dto: CreateImageDto) {
    const data = await this.getOne(parseInt(dto.publicacion), false);
    data.galeria[parseInt(dto.index)] = '0'
    await this.publicacionesRP.update(parseInt(dto.publicacion), {
      galeria: data.galeria
    });
    return await this.getOne(parseInt(dto.publicacion));
  }

  async updateGaleria(dto: UpdateImageDto) {
    const data = await this.getOne(dto.publicacion, false);
    data.galeria[dto.index] = dto.galeria
    await this.publicacionesRP.update(dto.publicacion, {
      galeria: data.galeria
    });
    return await this.getOne(dto.publicacion);
  }

}
