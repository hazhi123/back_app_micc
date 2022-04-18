import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComentariosEntity } from './entities/comentarios.entity';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { PublicacionesEntity } from '../publicaciones/entities/publicaciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComentariosEntity, PublicacionesEntity])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService]
})
export class ComentariosModule { }
