import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ProductosCategoriasEntity,
} from './entities/productos-categorias.entity';
import {
  ProductosCategoriasController,
} from './productos-categorias.controller';
import { ProductosCategoriasService } from './productos-categorias.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductosCategoriasEntity])],
  controllers: [ProductosCategoriasController],
  providers: [ProductosCategoriasService],
  exports: [ProductosCategoriasService]
})
export class ProductosCategoriasModule { }
