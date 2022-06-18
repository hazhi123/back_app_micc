import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CinesCComercialesEntity,
} from '../cines/cines/entities/cines-ccomerciales.entity';
import { GaleriaModule } from '../galeria/galeria.module';
import { PanoramasEntity } from '../panoramas/entities/panoramas.entity';
import { PanoramasModule } from '../panoramas/panoramas.module';
import {
  TiendasCComercialesEntity,
} from '../tiendas/entities/tiendas-ccomerciales.entity';
import {
  UsuariosCComercialesEntity,
} from '../usuarios/entities/usuarios-ccomerciales.entity';
import { CComercialesController } from './ccomerciales.controller';
import { CComercialesService } from './ccomerciales.service';
import {
  CComercialesGaleriaEntity,
} from './entities/ccomerciales-galeria.entity';
import { CComercialesEntity } from './entities/ccomerciales.entity';

@Module({
  imports: [GaleriaModule, PanoramasModule, TypeOrmModule.forFeature([
    CComercialesEntity,
    CComercialesGaleriaEntity,
    UsuariosCComercialesEntity,
    CinesCComercialesEntity,
    TiendasCComercialesEntity,
    PanoramasEntity,
  ])],
  controllers: [CComercialesController],
  providers: [CComercialesService],
  exports: [CComercialesService]
})
export class CComercialesModule { }
