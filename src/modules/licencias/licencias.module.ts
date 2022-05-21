import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { LicenciasEntity } from './entities/licencias.entity';
import { LicenciasController } from './licencias.controller';
import { LicenciasService } from './licencias.service';

@Module({
  imports: [TypeOrmModule.forFeature([LicenciasEntity, UsuariosEntity])],
  controllers: [LicenciasController],
  providers: [LicenciasService],
  exports: [LicenciasService]
})
export class LicenciasModule { }
