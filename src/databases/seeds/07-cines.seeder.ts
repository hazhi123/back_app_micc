import * as faker from 'faker';
import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  CinesCComercialesEntity,
} from '../../modules/cines/cines/entities/cines-ccomerciales.entity';
import {
  CinesGaleriaEntity,
} from '../../modules/cines/cines/entities/cines-galeria.entity';
import { CinesEntity } from '../../modules/cines/cines/entities/cines.entity';
import {
  PublicacionesEntity,
} from '../../modules/publicaciones/entities/publicaciones.entity';
import {
  UsuariosEntity,
} from '../../modules/usuarios/entities/usuarios.entity';

export default class CinesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(CinesEntity)()
      .map(async (ent) => {
        ent.image = Math.floor((Math.random() * 900) + 1);
        ent.imageBack = Math.floor((Math.random() * 900) + 1);
        return ent;
      })
      .createMany(10);

    // Relacion de Cines con CComerciales
    for (let x = 1; x <= 10; x++) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(CinesCComercialesEntity)
        .values({
          ubicacion: faker.address.city(),
          ccomercial: Math.floor((Math.random() * 15) + 1),
          cine: x
        })
        .execute()
    }

    // Galeria de imagenes
    for (let x = 1; x <= 10; x++) {
      var data = []
      for (let index = 0; index < 9; index++) {
        data.push({
          cineCC: x,
          index: index,
          galeria: Math.floor((Math.random() * 900) + 1),
        });
      }
      await connection
        .createQueryBuilder()
        .insert()
        .into(CinesGaleriaEntity)
        .values(data)
        .execute()
    }

    await factory(UsuariosEntity)()
      .map(async (user) => {
        user.ccomercial = 1;
        user.contrasena = '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi';
        user.cineCC = Math.floor((Math.random() * 10) + 1);
        user.ciudad = 149;
        user.image = Math.floor((Math.random() * 900) + 1);
        user.imageBack = Math.floor((Math.random() * 900) + 1);
        return user;
      })
      .createMany(89);

    await factory(PublicacionesEntity)()
      .map(async (ent) => {
        ent.ccomercial = 1;
        ent.cineCC = Math.floor((Math.random() * 10) + 1);
        ent.categoria = Math.floor((Math.random() * 30) + 1);
        ent.tipoPub = Math.floor((Math.random() * 4) + 1);
        ent.image = Math.floor((Math.random() * 900) + 1);
        return ent;
      })
      .createMany(256);

  }
}