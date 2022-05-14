import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  CComercialesCinesEntity,
} from '../../modules/ccomerciales/entities/ccomerciales-cines.entity';
import {
  CinesGaleriaEntity,
} from '../../modules/cines/cines/entities/cines-galeria.entity';
import { CinesEntity } from '../../modules/cines/cines/entities/cines.entity';

export default class CinesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(CinesEntity)()
      .map(async (ent) => {
        ent.image = Math.floor((Math.random() * 900) + 1);
        ent.imageBack = Math.floor((Math.random() * 900) + 1);
        return ent;
      })
      .createMany(10);

    for (let x = 1; x <= 10; x++) {
      var data = []
      for (let index = 0; index < 9; index++) {
        data.push({
          cine: x,
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

    for (let x = 1; x <= 10; x++) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(CComercialesCinesEntity)
        .values({
          ccomercial: 1,
          cine: x
        })
        .execute()
    }

  }
}