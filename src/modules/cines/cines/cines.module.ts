import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CinesController } from './cines.controller';
import { CinesService } from './cines.service';
import { CinesEntity } from './entities/cines.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CinesEntity])],
  controllers: [CinesController],
  providers: [CinesService],
  exports: [CinesService]
})
export class CinesModule { }
