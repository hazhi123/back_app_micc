import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PerfilesEntity } from './entities/perfiles.entity';
import { PerfilesController } from './perfiles.controller';
import { PerfilesService } from './perfiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilesEntity])],
  controllers: [PerfilesController],
  providers: [PerfilesService],
  exports: [PerfilesService]
})
export class PerfilesModule { }
