import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilesModule } from '../perfiles/perfiles.module';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    PerfilesModule,
    TypeOrmModule.forFeature([
      // TiendasCComercialesEntity
      UsuariosEntity
    ])
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule { }
