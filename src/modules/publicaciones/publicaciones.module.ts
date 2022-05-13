import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../galeria/galeria.module';
import {
  PublicacionesGaleriaEntity,
} from './entities/publicaciones-galeria.entity';
import { PublicacionesEntity } from './entities/publicaciones.entity';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([PublicacionesEntity, PublicacionesGaleriaEntity])],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [PublicacionesService]
})
export class PublicacionesModule { }
