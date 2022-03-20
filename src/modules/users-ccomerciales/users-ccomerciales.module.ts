import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  CComercialesEntity,
} from '../ccomerciales/entities/ccomerciales.entity';
import { PerfilesModule } from '../perfiles/perfiles.module';
import { UsersCComercialesEntity } from './entities/users-ccomerciales.entity';
import { UsersCComercialesController } from './users-ccomerciales.controller';
import { UsersCComercialesService } from './users-ccomerciales.service';

@Module({
  imports: [
    PerfilesModule,
    TypeOrmModule.forFeature([UsersCComercialesEntity, CComercialesEntity])
  ],
  controllers: [UsersCComercialesController],
  providers: [UsersCComercialesService],
  exports: [UsersCComercialesService]
})
export class UsersCComercialesModule { }
