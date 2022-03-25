import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { PublicacionesEntity } from '../publicaciones/entities/publicaciones.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { LikesEntity } from './entities/likes.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([LikesEntity, UsersEntity, PublicacionesEntity])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService]
})
export class LikesModule { }
