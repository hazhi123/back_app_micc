import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ModulosEntity } from '../modulos/entities/modulos.entity';
import { PerfilesEntity } from '../perfiles/entities/perfiles.entity';
import { PerfilesModule } from '../perfiles/perfiles.module';
import { PerfilesModulosEntity } from './entities/perfiles-modulos.entity';
import { PerfilesModulosController } from './perfiles-modulos.controller';
import { PerfilesModulosService } from './perfiles-modulos.service';

@Module({
  imports: [
    PerfilesModule,
    TypeOrmModule.forFeature([PerfilesEntity, PerfilesModulosEntity, ModulosEntity])
  ],
  controllers: [PerfilesModulosController],
  providers: [PerfilesModulosService],
  exports: [PerfilesModulosService]
})
export class PerfilesModulosModule { }
