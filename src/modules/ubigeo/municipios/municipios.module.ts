import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MunicipiosEntity } from './entities/municipios.entity';
import { MunicipiosController } from './municipios.controller';
import { MunicipiosService } from './municipios.service';

@Module({
  imports: [TypeOrmModule.forFeature([MunicipiosEntity])],
  controllers: [MunicipiosController],
  providers: [MunicipiosService],
  exports: [MunicipiosService]
})
export class MunicipiosModule { }
