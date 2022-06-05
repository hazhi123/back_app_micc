import * as faker from 'faker';
import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  PublicacionesEntity,
} from '../../modules/publicaciones/entities/publicaciones.entity';
import {
  TiendasCComercialesEntity,
} from '../../modules/tiendas/entities/tiendas-ccomerciales.entity';
import {
  TiendasGaleriaEntity,
} from '../../modules/tiendas/entities/tiendas-galeria.entity';
import { TiendasEntity } from '../../modules/tiendas/entities/tiendas.entity';
import {
  UsuariosEntity,
} from '../../modules/usuarios/entities/usuarios.entity';

export default class TiendasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(TiendasEntity)()
      .map(async (tie) => {
        // tie.categoria = Math.floor((Math.random() * 29) + 1);
        tie.image = Math.floor((Math.random() * 900) + 1);
        tie.imageBack = Math.floor((Math.random() * 900) + 1);
        return tie;
      })
      .createMany(60);

    for (let x = 1; x <= 15; x++) { //15 => ccomerciales
      var data = []
      for (let index = 1; index <= 60; index++) {
        data.push({
          tienda: index,
          ccomercial: x,
          correo: faker.internet.email(),
          telefonos: [`${faker.phone.phoneNumber()}`, `${faker.phone.phoneNumber()}`],
          abierto: faker.random.boolean(),
          ubicacion: faker.address.city(),
          createdBy: 1,
          updatedAt: 1,
          categoria: Math.floor((Math.random() * 200) + 1),
        });
      }

      await connection
        .createQueryBuilder()
        .insert()
        .into(TiendasCComercialesEntity)
        .values(data)
        .execute()
    }

    for (let x = 1; x <= 400; x++) {
      var data = []
      for (let index = 0; index < 9; index++) {
        data.push({
          tiendaCC: x,
          index: index,
          galeria: Math.floor((Math.random() * 900) + 1),
        });
      }
      await connection
        .createQueryBuilder()
        .insert()
        .into(TiendasGaleriaEntity)
        .values(data)
        .execute()
    }

    await factory(UsuariosEntity)()
      .map(async (user) => {
        user.ccomercial = 1;
        user.contrasena = '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi';
        user.tiendaCC = Math.floor((Math.random() * 30) + 1);
        user.ciudad = 149;
        user.image = Math.floor((Math.random() * 900) + 1);
        user.imageBack = Math.floor((Math.random() * 900) + 1);
        return user;
      })
      .createMany(100);

    await factory(PublicacionesEntity)()
      .map(async (ent) => {
        ent.ccomercial = 1;
        ent.tiendaCC = Math.floor((Math.random() * 60) + 1);
        ent.categoria = Math.floor((Math.random() * 30) + 1);
        ent.tipoPub = Math.floor((Math.random() * 4) + 1);
        ent.image = Math.floor((Math.random() * 900) + 1);
        return ent;
      })
      .createMany(1203);

  }
}