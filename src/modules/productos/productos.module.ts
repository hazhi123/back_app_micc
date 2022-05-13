import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../galeria/galeria.module';
import { ProductosGaleriaEntity } from './entities/productos-galeria.entity';
import { ProductosEntity } from './entities/productos.entity';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([
    ProductosEntity,
    ProductosGaleriaEntity,
  ])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService]
})
export class ProductosModule { }
