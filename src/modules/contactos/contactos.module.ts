import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilesModule } from '../perfiles/perfiles.module';
import { PublicacionesEntity } from '../publicaciones/entities/publicaciones.entity';
import { TiendasEntity } from '../tiendas/entities/tiendas.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { ContactosEntity } from './entities/contactos.entity';
import { ContactosController } from './contactos.controller';
import { ContactosService } from './contactos.service';

@Module({
  imports: [
    PerfilesModule,
    TypeOrmModule.forFeature([UsersEntity, ContactosEntity, TiendasEntity])
  ],
  controllers: [ContactosController],
  providers: [ContactosService],
  exports: [ContactosService]
})
export class ContactosModule { }
