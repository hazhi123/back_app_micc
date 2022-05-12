import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  TiendasGaleriaEntity,
} from '../../modules/tiendas/entities/tiendas-galeria.entity';
import { TiendasEntity } from '../../modules/tiendas/entities/tiendas.entity';

export default class TiendasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(TiendasEntity)()
      .map(async (tie) => {
        tie.ccomercial = 1;
        tie.categoria = Math.floor((Math.random() * 29) + 1);
        tie.image = Math.floor((Math.random() * 900) + 1);
        tie.imageBack = Math.floor((Math.random() * 900) + 1);
        return tie;
      })
      .createMany(60);

    for (let x = 1; x <= 60; x++) {
      var data = []

      for (let index = 0; index < 10; index++) {
        data.push({
          tienda: x,
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