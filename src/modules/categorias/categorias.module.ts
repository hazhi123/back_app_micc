import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { GaleriaEntity } from '../ccomerciales/entities/galeria.entity';

import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriasEntity } from './entities/categorias.entity';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([CategoriasEntity, GaleriaEntity])],
  controllers: [CategoriasController],
  providers: [CategoriasService],
  exports: [CategoriasService]
})
export class CategoriasModule { }
