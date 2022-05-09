import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import { TiendasEntity } from '../../modules/tiendas/entities/tiendas.entity';

export default class TiendasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(TiendasEntity)()
      .map(async (tie) => {
        tie.ccomercial = 1
        tie.categoria = Math.floor((Math.random() * 29) + 1);
        return tie;
      })
      .createMany(60);
  }
}