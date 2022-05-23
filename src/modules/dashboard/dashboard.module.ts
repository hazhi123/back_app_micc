import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriasEntity } from '../categorias/entities/categorias.entity';
import {
  CComercialesEntity,
} from '../ccomerciales/entities/ccomerciales.entity';
import { CinesEntity } from '../cines/cines/entities/cines.entity';
import { PeliculasEntity } from '../cines/peliculas/entities/peliculas.entity';
import { PerfilesModule } from '../perfiles/perfiles.module';
import { ProductosEntity } from '../productos/entities/productos.entity';
import {
  PublicacionesEntity,
} from '../publicaciones/entities/publicaciones.entity';
import { TiendasEntity } from '../tiendas/entities/tiendas.entity';
import {
  TiposPublicacionEntity,
} from '../tipos-publicacion/entities/tipos-publicacion.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    PerfilesModule,
    TypeOrmModule.forFeature([
      // TiendasCComercialesEntity
      UsuariosEntity,
      CComercialesEntity,
      CategoriasEntity,
      TiendasEntity,
      ProductosEntity,
      CinesEntity,
      PeliculasEntity,
      PublicacionesEntity,
      TiposPublicacionEntity,
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule { }
