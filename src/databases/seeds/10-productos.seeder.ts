import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  ProductosEntity,
} from '../../modules/productos/entities/productos.entity';

export default class ProductosSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(ProductosEntity)()
      .map(async (ent) => {
        ent.tienda = Math.floor((Math.random() * 59) + 1);
        ent.categoria = Math.floor((Math.random() * 29) + 1);
        ent.image = Math.floor((Math.random() * 900) + 1);
        ent.galeria = [
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
          Math.floor((Math.random() * 900) + 1),
        ];
        return ent;
      })
      .createMany(2490);
  }
}