import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PeliculasEntity } from './entities/peliculas.entity';
import { PeliculasController } from './peliculas.controller';
import { PeliculasService } from './peliculas.service';

@Module({
  imports: [TypeOrmModule.forFeature([PeliculasEntity])],
  controllers: [PeliculasController],
  providers: [PeliculasService],
  exports: [PeliculasService]
})
export class PeliculasModule { }
