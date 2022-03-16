import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  PerfilesModulosEntity,
} from '../perfiles-modulos/entities/perfiles-modulos.entity';
import { ModulosEntity } from './entities/modulos.entity';
import { ModulosController } from './modulos.controller';
import { ModulosService } from './modulos.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModulosEntity, PerfilesModulosEntity])],
  controllers: [ModulosController],
  providers: [ModulosService],
  exports: [ModulosService]
})
export class ModulosModule { }
