import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParroquiasEntity } from './entities/parroquias.entity';
import { ParroquiasController } from './parroquias.controller';
import { ParroquiasService } from './parroquias.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParroquiasEntity])],
  controllers: [ParroquiasController],
  providers: [ParroquiasService],
  exports: [ParroquiasService]
})
export class ParroquiasModule { }
