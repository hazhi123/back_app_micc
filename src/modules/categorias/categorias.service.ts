import { Repository } from 'typeorm';

import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as CONST from '../../common/constants';
import { isEmptyUndefined } from '../../common/helpers';
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { GaleriaService } from '../galeria/galeria.service';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateCategoriasDto,
  CreateImageDto,
  GetAllDto,
  UpdateCategoriasDto,
  UpdateImageDto,
} from './dto';
import { CategoriasEntity } from './entities/categorias.entity';

@Injectable()
export class CategoriasService {

  constructor(
    @InjectRepository(CategoriasEntity)
    private readonly categoriasRP: Repository<CategoriasEntity>,

    private galeriaService: GaleriaService

  ) { }

  async create(dto: CreateCategoriasDto, userLogin: UsersEntity) {
    await this.findNombre(dto.ccomercial, dto.nombre, false)
    const save = await this.categoriasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  async getAll(dto: GetAllDto): Promise<CategoriasEntity[]> {
    const query = await this.categoriasRP
      .createQueryBuilder("cat")
    query
      .leftJoinAndSelect("cat.ccomercial", "cc")
      .leftJoinAndSelect("cat.image", "gal")
      .select([
        'cat.id',
        'cat.nombre',
        'cat.desc',
        'cat.status',
        'gal.id',
        'gal.file',
      ])

    if (!isEmptyUndefined(dto.status)) {
      query.andWhere('cat.status = :status', { status: dto.status })
    }
    if (!isEmptyUndefined(dto.ccomercial)) {
      query.andWhere('cc.id = :ccId', { ccId: dto.ccomercial })
    }

    query.orderBy("cat.nombre", "ASC")

    const find = query.getMany();
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<CategoriasEntity> {
    return await this.categoriasRP.findOne({
      relations: ['image'],
      where: { id },
    });
  }

  async update(dto: UpdateCategoriasDto, userLogin: UsersEntity) {
    const findNombre = await this.findNombre(dto.ccomercial, dto.nombre, true)
    if (!isEmptyUndefined(findNombre)) delete dto.nombre

    const getOne = await this.getOne(dto.id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
    }, HttpStatus.ACCEPTED)

    const assingUsers = Object.assign(getOne, {
      ...dto,
      updatedBy: userLogin.id,
      updatedAt: Date(),
    })
    await this.categoriasRP.update(getOne.id, assingUsers);
    return await this.getOne(dto.id);
  }

  async delete(id: number) {
    const getOne = await this.getOne(id);
    if (isEmptyUndefined(getOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.ERROR.DELETE,
    }, HttpStatus.ACCEPTED)
    await this.categoriasRP.delete(id);
    return getOne;
  }

  async findNombre(ccomercial: number, nombre: string, data: boolean) {
    const findOne = await this.categoriasRP.findOne({ where: { nombre, ccomercial } })
    if (data) return findOne
    if (!isEmptyUndefined(findOne)) throw new HttpException({
      statusCode: HttpStatus.ACCEPTED,
      message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
    }, HttpStatus.ACCEPTED)
  }

  async createImage(file: any, dto: CreateImageDto, userLogin: UsersEntity) {

    let galeriaId;
    let res: GaleriaEntity
    try {
      const data = {
        entidad: 'ccomercial',
        entId: parseInt(dto.entId),
        referencia: 'categoria',
        refId: parseInt(dto.categoria),
      }
      res = await this.galeriaService.create(file, data, userLogin)
      galeriaId = res.id
    } catch (error) {
      galeriaId = null
      res = null
    }

    await this.categoriasRP.update(parseInt(dto.categoria),
      { image: galeriaId }
    );
    return res;
  }

  async updateImage(dto: UpdateImageDto) {
    await this.categoriasRP.update(dto.categoria,
      { image: dto.galeria }
    );
    return await this.getOne(dto.categoria);
  }

}
