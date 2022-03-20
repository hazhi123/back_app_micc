import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { UsersEntity } from '../users/entities/users.entity';
import { CComercialesController } from './ccomerciales.controller';
import { CComercialesService } from './ccomerciales.service';
import { CComercialesEntity } from './entities/ccomerciales.entity';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([CComercialesEntity, UsersEntity])],
  controllers: [CComercialesController],
  providers: [CComercialesService],
  exports: [CComercialesService]
})
export class CComercialesModule { }
