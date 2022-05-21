import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { isEmptyUndefined } from '../../common/helpers';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { CreateHorariosDto } from './dto';
import { HorariosEntity } from './entities/horarios.entity';

@Injectable()
export class HorariosService {

  relations = [
    'ccomercial',
    'tienda',
  ]

  constructor(
    @InjectRepository(HorariosEntity)
    private readonly horariosRP: Repository<HorariosEntity>
  ) { }

  async create(dto: CreateHorariosDto, userLogin: UsuariosEntity) {

    let getOne
    if (!isEmptyUndefined(dto.ccomercial)) {
      getOne = await this.horariosRP.findOne({
        where: { entidad: 'ccomercial', ccomercial: dto.ccomercial },
        relations: this.relations
      })
    }
    if (!isEmptyUndefined(dto.tienda)) {
      getOne = await this.horariosRP.findOne({
        where: { entidad: 'tienda', tienda: dto.tienda },
        relations: this.relations
      })
    }

    if (isEmptyUndefined(getOne)) {
      const save = await this.horariosRP.save({
        ...dto,
        createdBy: userLogin.id,
        createdAt: new Date(),
        updatedBy: userLogin.id,
        updatedAt: new Date(),
      });
      return await this.getOne(save.id);
    } else {
      await this.horariosRP.update(getOne.id, dto);
      return await this.getOne(getOne.id);
    }
  }

  async getAll(): Promise<HorariosEntity[]> {
    const find = await this.horariosRP.find({
      relations: this.relations,
    });
    if (isEmptyUndefined(find)) return null
    return find;
  }

  async getOne(id: number): Promise<HorariosEntity> {
    return await this.horariosRP.findOne({
      where: { id },
      relations: this.relations
    });
  }

}
