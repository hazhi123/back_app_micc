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
        pub.ccomercial = 1;
        pub.categoria = Math.floor((Math.random() * 30) + 1);
        pub.tipoPub = Math.floor((Math.random() * 4) + 1);
        pub.image = Math.floor((Math.random() * 900) + 1);
        pub.galeria = [
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
        ];
        return pub;
      })
      .createMany(269);

    await factory(PublicacionesEntity)()
      .map(async (pub) => {
        pub.ccomercial = 1;
        pub.tienda = Math.floor((Math.random() * 60) + 1);
        pub.categoria = Math.floor((Math.random() * 30) + 1);
        pub.tipoPub = Math.floor((Math.random() * 4) + 1);
        pub.image = Math.floor((Math.random() * 900) + 1);
        pub.galeria = [
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
        ];
        return pub;
      })
      .createMany(1203);
  }
}