import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PerfilesService } from '../perfiles/perfiles.service';
import { UsersEntity } from '../users/entities/users.entity';
import { CreatePerfilesModulosDto } from './dto';
import { PerfilesModulosEntity } from './entities/perfiles-modulos.entity';

@Injectable()
export class PerfilesModulosService {

  constructor(
    private readonly perfilesService: PerfilesService,

    @InjectRepository(PerfilesModulosEntity)
    private readonly perfilesModulosRP: Repository<PerfilesModulosEntity>,

  ) { }

  async create(dto: CreatePerfilesModulosDto, userLogin: UsersEntity) {

    await this.perfilesModulosRP
      .createQueryBuilder()
      .delete()
      .where("perfil = :id", { id: dto.perfil })
      .execute();

    for (let index = 0; index < dto.modulos.length; index++) {
      const modulo = dto.modulos[index];
      await this.perfilesModulosRP.save({
        perfil: dto.perfil,
        modulo,
        createdBy: userLogin.id,
        createdAt: new Date(),
        updatedBy: userLogin.id,
        updatedAt: new Date(),
      });
    }
    const getOne = await this.perfilesService.getOne(dto.perfil)
    return getOne;
  }

}
