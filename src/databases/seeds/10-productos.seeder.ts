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
        pub.tienda = Math.floor((Math.random() * 3) + 1);
        return pub;
      })
      .createMany(2490);
  }
}