import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CinesCComercialesEntity,
} from '../cines/cines/entities/cines-ccomerciales.entity';
import { GaleriaModule } from '../galeria/galeria.module';
import {
  TiendasCComercialesEntity,
} from '../tiendas/entities/tiendas-ccomerciales.entity';
import {
  UsersCComercialesEntity,
} from '../users/entities/users-ccomerciales.entity';
import { CComercialesController } from './ccomerciales.controller';
import { CComercialesService } from './ccomerciales.service';
import {
  CComercialesGaleriaEntity,
} from './entities/ccomerciales-galeria.entity';
import { CComercialesEntity } from './entities/ccomerciales.entity';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([
    CComercialesEntity,
    CComercialesGaleriaEntity,
    UsersCComercialesEntity,
    CinesCComercialesEntity,
    TiendasCComercialesEntity,
  ])],
  controllers: [CComercialesController],
  providers: [CComercialesService],
  exports: [CComercialesService]
})
export class CComercialesModule { }
