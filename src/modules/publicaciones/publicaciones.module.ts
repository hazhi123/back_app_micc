import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { PublicacionesEntity } from './entities/publicaciones.entity';
import { PublicacionesController } from './publicaciones.controller';
import { PublicacionesService } from './publicaciones.service';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([PublicacionesEntity, UsersEntity, GaleriaEntity])],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [PublicacionesService]
})
export class PublicacionesModule { }
