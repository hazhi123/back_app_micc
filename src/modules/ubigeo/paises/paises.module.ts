import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaisesEntity } from './entities/paises.entity';
import { PaisesController } from './paises.controller';
import { PaisesService } from './paises.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaisesEntity])],
  controllers: [PaisesController],
  providers: [PaisesService],
  exports: [PaisesService]
})
export class PaisesModule { }
