import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlanesEntity } from './entities/planes.entity';
import { PlanesController } from './planes.controller';
import { PlanesService } from './planes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanesEntity])],
  controllers: [PlanesController],
  providers: [PlanesService],
  exports: [PlanesService]
})
export class PlanesModule { }
