import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  PublicacionesGaleriaEntity,
} from '../../modules/publicaciones/entities/publicaciones-galeria.entity';
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
        return pub;
      })
      .createMany(269);

    for (let x = 1; x <= 1472; x++) {
      var data = []
      for (let index = 0; index < 9; index++) {
        data.push({
          publicacion: x,
          index: index,
          galeria: Math.floor((Math.random() * 900) + 1),
        });
      }
      await connection
        .createQueryBuilder()
        .insert()
        .into(PublicacionesGaleriaEntity)
        .values(data)
        .execute()
    }
  }
}