import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  PublicacionesEntity,
} from '../publicaciones/entities/publicaciones.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { LikesEntity } from './entities/likes.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikesEntity, UsuariosEntity, PublicacionesEntity])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService]
})
export class LikesModule { }
