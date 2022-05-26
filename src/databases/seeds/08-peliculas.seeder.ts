import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  PeliculasCategoriasEntity,
} from '../../modules/cines/peliculas-categorias/entities/peliculas-categorias.entity';
import {
  PeliculasCinesEntity,
} from '../../modules/cines/peliculas/entities/peliculas-cines.entity';
import {
  PeliculasEntity,
} from '../../modules/cines/peliculas/entities/peliculas.entity';

export default class PeliculasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(PeliculasCategoriasEntity)()
      .map(async (ent) => {
        return ent;
      })
      .createMany(100);

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
          cineCC: x,
          pelicula: Math.floor((Math.random() * 30) + 1)
        });
      }
      await connection
        .createQueryBuilder()
        .insert()
        .into(PeliculasCinesEntity)
        .values(data)
        .execute()
    }

  }
}