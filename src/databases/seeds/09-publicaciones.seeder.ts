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

    for (let x = 1; x <= 269; x++) {
      var data = []
      for (let index = 0; index < 10; index++) {
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

    await factory(PublicacionesEntity)()
      .map(async (ent) => {
        ent.ccomercial = 1;
        ent.tienda = Math.floor((Math.random() * 60) + 1);
        ent.categoria = Math.floor((Math.random() * 30) + 1);
        ent.tipoPub = Math.floor((Math.random() * 4) + 1);
        ent.image = Math.floor((Math.random() * 900) + 1);
        return ent;
      })
      .createMany(1203);

    for (let x = 1; x <= 1203; x++) {
      var data = []
      for (let index = 0; index < 10; index++) {
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