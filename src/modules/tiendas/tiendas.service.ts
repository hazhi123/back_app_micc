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
  UpdateTiendasDto,
} from './dto';
import { TiendasEntity } from './entities/tiendas.entity';

@Injectable()
export class TiendasService {

  relations = []

  constructor(
    @InjectRepository(TiendasEntity)
    private readonly tiendasRP: Repository<TiendasEntity>,

    @InjectRepository(LicenciasEntity)
    private readonly licenciasRP: Repository<LicenciasEntity>,

    private cloudinary: CloudinaryService
  ) { }

  async create(dto: CreateTiendasDto, userLogin: UsersEntity) {
    await this.findNombre(dto.nombre, false)
    const save = await this.tiendasRP.save({
      ...dto,
      createdBy: userLogin.id,
      createdAt: new Date(),
      updatedBy: userLogin.id,
      updatedAt: new Date(),
      status: true
    });
    // await createLicenciasFree(this.licenciasRP, this.usersRP, { userId: dto.user, userLoginId: userLogin.id })
    return await this.getOne(save.id);
  }

  async getAll(): Promise<TiendasEntity[]> {
    const find = await this.tiendasRP.find({
      relations: this.relations,
      order: { 'id': 'DESC' },
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

  async createImage(file: any, id: number) {
    let image
    try {
      image = await this.uploadImageToCloudinary(file)
    } catch (error) {
      image = { url: '' }
    }
    await this.tiendasRP.createQueryBuilder()
      .update(TiendasEntity)
      .set({ image: image.url })
      .where("id = :id", { id })
      .execute();
    return await this.getOne(id);
  }

}
