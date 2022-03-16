import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  PerfilesModulosEntity,
} from '../../modules/perfiles-modulos/entities/perfiles-modulos.entity';

export default class PerfilesModulosSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(PerfilesModulosEntity)
      .values([
        // { profile: 2, modulo: 1, createdBy: 1, updatedBy: 1 },
        // { profile: 2, modulo: 2, createdBy: 1, updatedBy: 1 },
      ])
      .execute()
  }
}