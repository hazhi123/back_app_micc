import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  CComercialesEntity,
} from '../../modules/ccomerciales/entities/ccomerciales.entity';

export default class CComercialesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(CComercialesEntity)()
      .map(async (cc) => {
        cc.ciudad = 149;
        return cc;
      })
      .createMany(3);
  }
}