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
        tie.ccomercial = Math.floor((Math.random() * 3) + 1);
        tie.categoria = Math.floor((Math.random() * 10) + 1);
        return tie;
      })
      .createMany(607);
  }
}