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
    // Auth
    MOD.AuthModule,

    // Administracion
    MOD.UsersModule,
    MOD.ProfilesModule,
    MOD.ModulosModule,
    MOD.ProfilesModulosModule,

    // Licencias
    MOD.LicensesModule,
    MOD.PlansModule,

    // Empresa
    MOD.BusinessModule,
    MOD.SucursalesModule,
    MOD.SalonesModule,
    MOD.MesasModule,
    MOD.AreasModule,

    // Stock
    MOD.UnitsMeasurementModule,
    MOD.ProveedoresModule,
    MOD.ProductsCategoriesModule,
    MOD.ProductsModule,
    MOD.IngredientsModule,
    MOD.ProductsAreasModule,

    // Clientes
    MOD.ClientsModule,

    // Pedidos
    MOD.PedidosModule,

    CloudinaryModule,

    // Suggestions
    // MOD.SuggestionsModule,
    // MOD.TypesSuggestionModule,
  ],
  providers: [AppGateway, CloudinaryProvider, CloudinaryService]
})
export class AppModule { }
