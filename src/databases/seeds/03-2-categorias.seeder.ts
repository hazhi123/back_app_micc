import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  CategoriasEntity,
} from '../../modules/categorias/entities/categorias.entity';

export default class CategoriasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(CategoriasEntity)()
      .map(async (cat) => {
        cat.ccomercial = Math.floor((Math.random() * 15) + 1);;
        cat.image = Math.floor((Math.random() * 900) + 1);
        return cat;
      })
      .createMany(200);
  }
}