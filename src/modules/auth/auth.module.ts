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
  UsuariosInformacionEntity,
} from '../usuarios/entities/usuarios-informacion.entity';
import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
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
    UsuariosModule,
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
      UsuariosEntity,
      UsuariosInformacionEntity,
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
