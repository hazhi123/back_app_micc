import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../galeria/galeria.module';
import {
  TiendasCComercialesEntity,
} from './entities/tiendas-ccomerciales.entity';
import { TiendasGaleriaEntity } from './entities/tiendas-galeria.entity';
import { TiendasEntity } from './entities/tiendas.entity';
import { TiendasController } from './tiendas.controller';
import { TiendasService } from './tiendas.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([
    TiendasEntity,
    TiendasCComercialesEntity,
    TiendasGaleriaEntity
  ])],
  controllers: [TiendasController],
  providers: [TiendasService],
  exports: [TiendasService]
})
export class TiendasModule { }
