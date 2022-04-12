import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HorariosEntity } from './entities/horarios.entity';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HorariosEntity])
  ],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports: [HorariosService]
})
export class HorariosModule { }
