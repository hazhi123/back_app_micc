import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../../../modules/galeria/galeria.module';
import { CinesController } from './cines.controller';
import { CinesService } from './cines.service';
import { CinesCComercialesEntity } from './entities/cines-ccomerciales.entity';
import { CinesGaleriaEntity } from './entities/cines-galeria.entity';
import { CinesPeliculasEntity } from './entities/cines-peliculas.entity';
import { CinesEntity } from './entities/cines.entity';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([
    CinesEntity,
    CinesPeliculasEntity,
    CinesGaleriaEntity,
    CinesCComercialesEntity,
  ])],
  controllers: [CinesController],
  providers: [CinesService],
  exports: [CinesService]
})
export class CinesModule { }
