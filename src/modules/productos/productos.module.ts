import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../galeria/galeria.module';
import { UsersEntity } from '../users/entities/users.entity';
import { ProductosEntity } from './entities/productos.entity';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([ProductosEntity, UsersEntity])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService]
})
export class ProductosModule { }
