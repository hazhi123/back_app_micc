import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GaleriaService } from '../galeria/galeria.service';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { CreatePanoramasDto } from './dto';
import { PanoramasEntity } from './entities/panoramas.entity';

// import { PanoramasEntity } from './entities/panoramas.entity';

@Injectable()
export class PanoramasService {

  constructor(
    @InjectRepository(PanoramasEntity)
    private readonly panoramasRP: Repository<PanoramasEntity>,

    private galeriaService: GaleriaService

  ) { }

  async create(dto: CreatePanoramasDto, userLogin: UsuariosEntity) {
    const save = await this.panoramasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
    });
    return await this.getOne(save.id);
  }

  // async getAll(dto: GetAllDto): Promise<PanoramasEntity[]> {
  //   const query = await this.panoramasRP
  //     .createQueryBuilder("cat")
  //   query
  //     .leftJoinAndSelect("cat.ccomercial", "cc")
  //     .leftJoinAndSelect("cat.image", "gal")
  //     .select([
  //       'cat.id',
  //       'cat.nombre',
  //       'cat.desc',
  //       'cat.status',
  //       'gal.id',
  //       'gal.file',
  //     ])

  //   if (!isEmptyUndefined(dto.status)) {
  //     query.andWhere('cat.status = :status', { status: dto.status })
  //   }
  //   if (!isEmptyUndefined(dto.ccomercial)) {
  //     query.andWhere('cc.id = :ccomercial', { ccomercial: dto.ccomercial })
  //   }

  //   query.orderBy("cat.nombre", "ASC")

  //   const find = query.getMany();
  //   if (isEmptyUndefined(find)) return null
  //   return find;
  // }

  async getOne(id: number): Promise<PanoramasEntity> {
    return await this.panoramasRP.findOne({
      relations: ['image'],
      where: { id },
    });
  }

  // async update(dto: UpdatePanoramasDto, userLogin: UsuariosEntity) {
  //   const findNombre = await this.findNombre(dto.ccomercial, dto.nombre, true)
  //   if (!isEmptyUndefined(findNombre)) delete dto.nombre

  //   const getOne = await this.getOne(dto.id);
  //   if (isEmptyUndefined(getOne)) throw new HttpException({
  //     statusCode: HttpStatus.ACCEPTED,
  //     message: CONST.MESSAGES.COMMON.ERROR.UPDATE,
  //   }, HttpStatus.ACCEPTED)

  //   const assingUsers = Object.assign(getOne, {
  //     ...dto,
  //     updatedBy: userLogin.id,
  //     updatedAt: Date(),
  //   })
  //   await this.panoramasRP.update(getOne.id, assingUsers);
  //   return await this.getOne(dto.id);
  // }

  // async delete(id: number) {
  //   const getOne = await this.getOne(id);
  //   if (isEmptyUndefined(getOne)) throw new HttpException({
  //     statusCode: HttpStatus.ACCEPTED,
  //     message: CONST.MESSAGES.COMMON.ERROR.DELETE,
  //   }, HttpStatus.ACCEPTED)
  //   await this.panoramasRP.delete(id);
  //   return getOne;
  // }

  // async findNombre(ccomercial: number, nombre: string, data: boolean) {
  //   const findOne = await this.panoramasRP.findOne({ where: { nombre, ccomercial } })
  //   if (data) return findOne
  //   if (!isEmptyUndefined(findOne)) throw new HttpException({
  //     statusCode: HttpStatus.ACCEPTED,
  //     message: CONST.MESSAGES.COMMON.WARNING.NAME_DATA,
  //   }, HttpStatus.ACCEPTED)
  // }

  // async createImage(file: any, dto: CreateImageDto, userLogin: UsuariosEntity) {

  //   let galeriaId;
  //   let res: GaleriaEntity
  //   try {
  //     const data = {
  //       entidad: 'ccomercial',
  //       entId: parseInt(dto.entId),
  //       referencia: 'categoria',
  //       refId: parseInt(dto.categoria),
  //     }
  //     res = await this.galeriaService.create(file, data, userLogin)
  //     galeriaId = res.id
  //   } catch (error) {
  //     galeriaId = null
  //     res = null
  //   }

  //   await this.panoramasRP.update(parseInt(dto.categoria),
  //     { image: galeriaId }
  //   );
  //   return res;
  // }

  // async updateImage(dto: UpdateImageDto) {
  //   await this.panoramasRP.update(dto.categoria,
  //     { image: dto.galeria }
  //   );
  //   return await this.getOne(dto.categoria);
  // }

}
