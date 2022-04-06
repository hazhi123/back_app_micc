import { AccessControlModule } from 'nest-access-control';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as ormconfig from '../ormconfig';
import { roles } from './app.roles';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import * as MOD from './modules';
import { AppGateway } from './websocket/app.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormconfig,
      keepConnectionAlive: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AccessControlModule.forRoles(roles),
    MOD.AuthModule,
    MOD.UsersModule,
    MOD.PerfilesModule,
    MOD.ModulosModule,
    MOD.PerfilesModulosModule,
    MOD.LicenciasModule,
    MOD.PlanesModule,

    MOD.PaisesModule,
    MOD.CiudadesModule,
    MOD.CategoriasModule,
    MOD.CComercialesModule,
    MOD.UsersCComercialesModule,
    MOD.TiendasModule,

    MOD.TiposPublicacionModule,
    MOD.PublicacionesModule,
    MOD.PublicacionesModule,
    MOD.ComentariosModule,
    MOD.LikesModule,
    MOD.GuardadosModule,
    MOD.ContactosModule,
    MOD.MensajesModule,
    MOD.GaleriaModule,

    CloudinaryModule,

    // Suggestions
    // MOD.SuggestionsModule,
    // MOD.TypesSuggestionModule,
  ],
  providers: [AppGateway, CloudinaryProvider, CloudinaryService]
})
export class AppModule { }
