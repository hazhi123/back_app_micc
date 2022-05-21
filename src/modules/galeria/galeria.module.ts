import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import {
  PublicacionesEntity,
} from '../publicaciones/entities/publicaciones.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { GaleriaEntity } from './entities/galeria.entity';
import { GaleriaController } from './galeria.controller';
import { GaleriaService } from './galeria.service';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([UsuariosEntity, GaleriaEntity, PublicacionesEntity])
  ],
  controllers: [GaleriaController],
  providers: [GaleriaService],
  exports: [GaleriaService]
})
export class GaleriaModule { }
