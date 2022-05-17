import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../../galeria/galeria.module';
import { PeliculasCinesEntity } from './entities/peliculas-cines.entity';
import { PeliculasEntity } from './entities/peliculas.entity';
import { PeliculasController } from './peliculas.controller';
import { PeliculasService } from './peliculas.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([
    PeliculasEntity,
    PeliculasCinesEntity,
  ])],
  controllers: [PeliculasController],
  providers: [PeliculasService],
  exports: [PeliculasService]
})
export class PeliculasModule { }
