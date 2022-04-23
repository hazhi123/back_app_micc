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
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { isEmptyUndefined } from '../../common/helpers';
import { UsersEntity } from '../users/entities/users.entity';
import {
  CreateGaleriaDto,
  GetAllxAtributoDto,
} from './dto';
import { GaleriaEntity } from './entities/galeria.entity';

@Injectable()
export class GaleriaService {

  constructor(
    @InjectRepository(GaleriaEntity)
    private readonly galeriaRP: Repository<GaleriaEntity>,

    private cloudinary: CloudinaryService

  ) { }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async create(file, dto: CreateGaleriaDto, userLogin: UsersEntity) {
    try {
      let image = await this.uploadImageToCloudinary(file)
      const save = await this.galeriaRP.save({
        ...dto,
        file: image.secure_url,
        createdBy: userLogin.id,
        createdAt: new Date(),
        updatedBy: userLogin.id,
        updatedAt: new Date(),
        status: true
      });

      const getOne = await this.getOne(save.id)
      return getOne;
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: 'Ocurrio un error al subir la imagén, por favor intente de nuevo',
      }, HttpStatus.BAD_GATEWAY)
    }
  }

  async getOne(id: number): Promise<GaleriaEntity> {
    return await this.galeriaRP.findOne({
      where: { id },
    });
  }

  async buscador(dto) {
    let search = {}
    if (!isEmptyUndefined(dto.id)) search['id'] = dto.id
    if (!isEmptyUndefined(dto.entidad)) search['entidad'] = dto.entidad
    if (!isEmptyUndefined(dto.entId)) search['entId'] = dto.entId
    if (!isEmptyUndefined(dto.titular)) search['titular'] = dto.titular
    if (!isEmptyUndefined(dto.refId)) search['refId'] = dto.refId
    return search
  }

  async getAllxAtributo(dto: GetAllxAtributoDto, options: IPaginationOptions): Promise<Pagination<GaleriaEntity>> {
    return paginate<GaleriaEntity>(this.galeriaRP, options, {
      where: await this.buscador(dto),
      order: { 'id': 'DESC' },
    });
  }

  async deleteImageToCloudinary(file: string) {
    return await this.cloudinary.deleteImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async delete(id: number) {
    //http://res.cloudinary.com/dqjirfzaa/image/upload/v1648706352/vwc7ptrctmetsx1uzmor.jpg
    //http://res.cloudinary.com/hazhi123/image/upload/v1648706352/vwc7ptrctmetsx1uzmor.jpg
    const getOne = await this.getOne(id);

    // const val = getOne.file.replace('http://res.cloudinary.com/dqjirfzaa/image/upload/', '');
    const val = getOne.file.replace('http://res.cloudinary.com/hazhi123/image/upload/', '');
    const lista = val.split('/')[1].split('.');

    try {
      await this.galeriaRP.delete(id);
      let image = await this.deleteImageToCloudinary(lista[0])
      return image.result;
    } catch (error) {
      throw new HttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'La imagen se encuentra en uso, no se puede eliminar',
      }, HttpStatus.ACCEPTED)
    }

  }

}
