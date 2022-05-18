import * as faker from 'faker';
import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  TiendasCComercialesEntity,
} from '../../modules/tiendas/entities/tiendas-ccomerciales.entity';
import {
  TiendasGaleriaEntity,
} from '../../modules/tiendas/entities/tiendas-galeria.entity';
import { TiendasEntity } from '../../modules/tiendas/entities/tiendas.entity';

export default class TiendasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(TiendasEntity)()
      .map(async (tie) => {
        tie.categoria = Math.floor((Math.random() * 29) + 1);
        tie.image = Math.floor((Math.random() * 900) + 1);
        tie.imageBack = Math.floor((Math.random() * 900) + 1);
        return tie;
      })
      .createMany(60);

    for (let x = 1; x <= 15; x++) {
      var data = []
      for (let index = 1; index <= 60; index++) {
        data.push({
          tienda: index,
          ccomercial: x,
          correo: faker.internet.email(),
          telPrimero: faker.phone.phoneNumber(),
          abierto: faker.random.boolean(),
          ubicacion: faker.address.city(),
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

  }
}