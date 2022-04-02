import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { GaleriaEntity } from '../galeria/entities/galeria.entity';
import { ModulosEntity } from '../modulos/entities/modulos.entity';
import { PerfilesEntity } from '../perfiles/entities/perfiles.entity';
import { PerfilesModule } from '../perfiles/perfiles.module';
import { UsersInformacionEntity } from './entities/users-informacion.entity';
import { UsersEntity } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    PerfilesModule,
    CloudinaryModule,
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersInformacionEntity,
      ModulosEntity,
      PerfilesEntity,
      GaleriaEntity,
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
