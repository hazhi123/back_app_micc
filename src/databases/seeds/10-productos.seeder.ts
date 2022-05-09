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
      .map(async (pub) => {
        pub.tienda = Math.floor((Math.random() * 59) + 1);
        pub.categoria = Math.floor((Math.random() * 29) + 1);
        return pub;
      })
      .createMany(2490);
  }
}