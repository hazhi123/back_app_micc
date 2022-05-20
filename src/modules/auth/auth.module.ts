import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SECRET } from '../../config';
import { LicenciasModule } from '../licencias/licencias.module';
import {
  UsersInformacionEntity,
} from '../users/entities/users-informacion.entity';
import { UsersEntity } from '../users/entities/users.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  JwtStrategy,
  LocalStrategy,
} from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    UsersModule,
    LicenciasModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>(SECRET),
        signOptions: {
          expiresIn: '24h'
        }
      })
    }),
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersInformacionEntity,
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
