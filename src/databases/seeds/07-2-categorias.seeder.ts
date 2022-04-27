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
        cat.ccomercial = Math.floor((Math.random() * 20) + 1);
        return cat;
      })
      .createMany(500);
  }
}