import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CiudadesController } from './ciudades.controller';
import { CiudadesService } from './ciudades.service';
import { CiudadesEntity } from './entities/ciudades.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadesEntity])],
  controllers: [CiudadesController],
  providers: [CiudadesService],
  exports: [CiudadesService]
})
export class CiudadesModule { }
