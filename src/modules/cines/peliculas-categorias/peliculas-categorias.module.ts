import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  PeliculasCategoriasEntity,
} from './entities/peliculas-categorias.entity';
import {
  PeliculasCategoriasController,
} from './peliculas-categorias.controller';
import { PeliculasCategoriasService } from './peliculas-categorias.service';

@Module({
  imports: [TypeOrmModule.forFeature([PeliculasCategoriasEntity])],
  controllers: [PeliculasCategoriasController],
  providers: [PeliculasCategoriasService],
  exports: [PeliculasCategoriasService]
})
export class PeliculasCategoriasModule { }
