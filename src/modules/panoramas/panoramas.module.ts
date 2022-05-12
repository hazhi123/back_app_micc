import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../galeria/galeria.module';
import { CategoriasEntity } from './entities/panoramas.entity';
import { CategoriasController } from './panoramas.controller';
import { CategoriasService } from './panoramas.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([CategoriasEntity])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService]
})
export class CategoriasModule { }
