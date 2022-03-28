import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { GaleriaEntity } from '../ccomerciales/entities/galeria.entity';
import { LicenciasEntity } from '../licencias/entities/licencias.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { TiendasEntity } from './entities/tiendas.entity';
import { TiendasController } from './tiendas.controller';
import { TiendasService } from './tiendas.service';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([TiendasEntity, UsersEntity, LicenciasEntity, GaleriaEntity])],
  controllers: [TiendasController],
  providers: [TiendasService],
  exports: [TiendasService]
})
export class TiendasModule { }
