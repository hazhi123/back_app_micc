import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersEntity } from '../users/entities/users.entity';
import { LicenciasEntity } from './entities/licencias.entity';
import { LicenciasController } from './licencias.controller';
import { LicenciasService } from './licencias.service';

@Module({
  imports: [TypeOrmModule.forFeature([LicenciasEntity, UsersEntity])],
  controllers: [LicenciasController],
  providers: [LicenciasService],
  exports: [LicenciasService]
})
export class LicenciasModule { }
