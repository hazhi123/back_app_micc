import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../../../modules/galeria/galeria.module';
import {
  PeliculasCinesEntity,
} from '../peliculas/entities/peliculas-cines.entity';
import { CinesController } from './cines.controller';
import { CinesService } from './cines.service';
import { CinesCComercialesEntity } from './entities/cines-ccomerciales.entity';
import { CinesEntity } from './entities/cines.entity';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([
    CinesEntity,
    CinesCComercialesEntity,
    PeliculasCinesEntity,
  ])],
  controllers: [CinesController],
  providers: [CinesService],
  exports: [CinesService]
})
export class CinesModule { }
