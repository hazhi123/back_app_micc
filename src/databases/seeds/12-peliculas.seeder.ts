import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  CinesPeliculasEntity,
} from '../../modules/cines/cines/entities/cines-peliculas.entity';
import {
  PeliculasEntity,
} from '../../modules/cines/peliculas/entities/peliculas.entity';

export default class PeliculasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(PeliculasEntity)()
      .map(async (ent) => {
        ent.image = Math.floor((Math.random() * 900) + 1);
        ent.imageBack = Math.floor((Math.random() * 900) + 1);
        ent.trailer = Math.floor((Math.random() * 900) + 1);
        return ent;
      })
      .createMany(30);

    for (let x = 1; x <= 10; x++) {
      var data = []
      for (let index = 0; index < 20; index++) {
        data.push({
          cine: x,
          pelicula: Math.floor((Math.random() * 30) + 1)
        });
      }
      await connection
        .createQueryBuilder()
        .insert()
        .into(CinesPeliculasEntity)
        .values(data)
        .execute()
    }

  }
}