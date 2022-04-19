import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CComercialesEntity,
} from '../ccomerciales/entities/ccomerciales.entity';
import { GaleriaModule } from '../galeria/galeria.module';
import { LicenciasEntity } from '../licencias/entities/licencias.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { TiendasEntity } from './entities/tiendas.entity';
import { TiendasController } from './tiendas.controller';
import { TiendasService } from './tiendas.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([CComercialesEntity, TiendasEntity, UsersEntity, LicenciasEntity])],
  controllers: [TiendasController],
  providers: [TiendasService],
  exports: [TiendasService]
})
export class TiendasModule { }
