import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilesModule } from '../perfiles/perfiles.module';
import { PublicacionesEntity } from '../publicaciones/entities/publicaciones.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { GuardadosEntity } from './entities/guardados.entity';
import { GuardadosController } from './guardados.controller';
import { GuardadosService } from './guardados.service';

@Module({
  imports: [
    PerfilesModule,
    TypeOrmModule.forFeature([UsersEntity, GuardadosEntity, PublicacionesEntity])
  ],
  controllers: [GuardadosController],
  providers: [GuardadosService],
  exports: [GuardadosService]
})
export class GuardadosModule { }
