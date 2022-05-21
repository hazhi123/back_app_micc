import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  ProductosGaleriaEntity,
} from '../../modules/productos/entities/productos-galeria.entity';
import {
  ProductosEntity,
} from '../../modules/productos/entities/productos.entity';

export default class ProductosSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(ProductosEntity)()
      .map(async (ent) => {
        ent.tiendaCC = Math.floor((Math.random() * 620) + 1);
        ent.categoria = Math.floor((Math.random() * 30) + 1);
        ent.image = Math.floor((Math.random() * 900) + 1);
        return ent;
      })
      .createMany(2490);

    for (let x = 1; x <= 2490; x++) {
      var data = []
      for (let index = 0; index < 9; index++) {
        data.push({
          producto: x,
          index: index,
          galeria: Math.floor((Math.random() * 900) + 1),
        });
      }
      await connection
        .createQueryBuilder()
        .insert()
        .into(ProductosGaleriaEntity)
        .values(data)
        .execute()
    }
  }
}