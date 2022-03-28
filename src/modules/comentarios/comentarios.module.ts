import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { UsersEntity } from '../users/entities/users.entity';
import { ComentariosEntity } from './entities/comentarios.entity';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { PublicacionesEntity } from '../publicaciones/entities/publicaciones.entity';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([ComentariosEntity, UsersEntity, PublicacionesEntity])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService]
})
export class ComentariosModule { }
