import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TiposPublicacionEntity } from './entities/tipos-publicacion.entity';
import { TiposPublicacionController } from './tipos-publicacion.controller';
import { TiposPublicacionService } from './tipos-publicacion.service';

@Module({
  imports: [TypeOrmModule.forFeature([TiposPublicacionEntity])],
  controllers: [TiposPublicacionController],
  providers: [TiposPublicacionService],
  exports: [TiposPublicacionService]
})
export class TiposPublicacionModule { }
