import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  CComercialesEntity,
} from '../../modules/ccomerciales/entities/ccomerciales.entity';

export default class CComercialesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CComercialesEntity)
      .values([
        {
          nombre: "Mall de Sur",
          correo: 'malsur@gmail.com',
          telPrimero: '123456789',
          direccion: 'Lima',
          desc: 'Mall de Sur',
          pais: 2,
          createdBy: 1,
          updatedBy: 1,
        },
        {
          nombre: "Plaza Norte",
          correo: 'plzanorte@gmail.com',
          telPrimero: '123456789',
          direccion: 'Lima',
          desc: 'Plaza Norte',
          pais: 2,
          createdBy: 1,
          updatedBy: 1,
        },
      ])
      .execute()
  }
}