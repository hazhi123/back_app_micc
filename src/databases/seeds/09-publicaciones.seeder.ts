import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  PublicacionesEntity,
} from '../../modules/publicaciones/entities/publicaciones.entity';

export default class PublicacionesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(PublicacionesEntity)()
      .map(async (pub) => {
        pub.ccomercial = Math.floor((Math.random() * 3) + 1);
        pub.categoria = Math.floor((Math.random() * 20) + 1);
        return pub;
      })
      .createMany(978);

    await factory(PublicacionesEntity)()
      .map(async (pub) => {
        pub.ccomercial = Math.floor((Math.random() * 3) + 1);
        pub.tienda = Math.floor((Math.random() * 3) + 1);
        pub.categoria = Math.floor((Math.random() * 20) + 1);
        return pub;
      })
      .createMany(1203);
  }
}