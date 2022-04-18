import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaModule } from '../galeria/galeria.module';
import { UsersEntity } from '../users/entities/users.entity';
import { CComercialesController } from './ccomerciales.controller';
import { CComercialesService } from './ccomerciales.service';
import { CComercialesEntity } from './entities/ccomerciales.entity';

@Module({
  imports: [GaleriaModule, TypeOrmModule.forFeature([CComercialesEntity, UsersEntity])],
  controllers: [CComercialesController],
  providers: [CComercialesService],
  exports: [CComercialesService]
})
export class CComercialesModule { }
