import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../galeria/galeria.module';
import { PanoramasEntity } from './entities/panoramas.entity';
import { PanoramasController } from './panoramas.controller';
import { PanoramasService } from './panoramas.service';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([PanoramasEntity])],
  controllers: [PanoramasController],
  providers: [PanoramasService],
  exports: [PanoramasService]
})
export class PanoramasModule { }
