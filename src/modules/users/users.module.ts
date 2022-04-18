import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { GaleriaModule } from '../galeria/galeria.module';
import { UsersInformacionEntity } from './entities/users-informacion.entity';
import { UsersEntity } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    GaleriaModule,
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersInformacionEntity,
      GaleriaEntity,
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
