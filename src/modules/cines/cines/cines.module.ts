import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../../../modules/galeria/galeria.module';
import {
  CComercialesCinesEntity,
} from '../../ccomerciales/entities/ccomerciales-cines.entity';
import { CinesController } from './cines.controller';
import { CinesService } from './cines.service';
import { CinesGaleriaEntity } from './entities/cines-galeria.entity';
import { CinesPeliculasEntity } from './entities/cines-peliculas.entity';
import { CinesEntity } from './entities/cines.entity';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([
    CinesEntity,
    CinesPeliculasEntity,
    CinesGaleriaEntity,
    CComercialesCinesEntity,
  ])],
  controllers: [CinesController],
  providers: [CinesService],
  exports: [CinesService]
})
export class CinesModule { }
