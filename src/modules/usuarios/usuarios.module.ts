import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { GaleriaModule } from '../galeria/galeria.module';
import { LicenciasModule } from '../licencias/licencias.module';
import {
  UsuariosCComercialesEntity,
} from './entities/usuarios-ccomerciales.entity';
import {
  UsuariosInformacionEntity,
} from './entities/usuarios-informacion.entity';
import { UsuariosEntity } from './entities/usuarios.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [
    GaleriaModule,
    LicenciasModule,
    TypeOrmModule.forFeature([
      UsuariosEntity,
      UsuariosCComercialesEntity,
      UsuariosInformacionEntity,
      GaleriaEntity,
    ])
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule { }
