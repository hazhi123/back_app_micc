import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilesModule } from '../perfiles/perfiles.module';
import {
  TiendasCComercialesEntity,
} from '../tiendas/entities/tiendas-ccomerciales.entity';
import { ContactosController } from './contactos.controller';
import { ContactosService } from './contactos.service';
import { ContactosEntity } from './entities/contactos.entity';

@Module({
  imports: [
    PerfilesModule,
    TypeOrmModule.forFeature([
      ContactosEntity,
      TiendasCComercialesEntity
    ])
  ],
  controllers: [ContactosController],
  providers: [ContactosService],
  exports: [ContactosService]
})
export class ContactosModule { }
