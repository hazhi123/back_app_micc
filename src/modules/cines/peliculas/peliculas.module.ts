import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../../galeria/galeria.module';
import { PeliculasEntity } from './entities/peliculas.entity';
import { PeliculasController } from './peliculas.controller';
import { PeliculasService } from './peliculas.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([PeliculasEntity])],
  controllers: [PeliculasController],
  providers: [PeliculasService],
  exports: [PeliculasService]
})
export class PeliculasModule { }
