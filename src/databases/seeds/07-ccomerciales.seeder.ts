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
          nombre: "El Sambil",
          correo: 'sambil@gmail.com',
          telPrimero: '123456789',
          direccion: 'Caracas',
          desc: 'El Sambil',
          createdBy: 1,
          updatedBy: 1,
        },
        {
          nombre: "El Recreo",
          correo: 'recreo@gmail.com',
          telPrimero: '123456789',
          direccion: 'Caracas',
          desc: 'El Recreo',
          createdBy: 1,
          updatedBy: 1,
        },
      ])
      .execute()
  }
}