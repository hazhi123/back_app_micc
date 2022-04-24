import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  CiudadesEntity,
} from '../../modules/ciudades/entities/ciudades.entity';

export default class CategoriasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CiudadesEntity)
      .values([
        { nombre: "Venezuela", pais: 1, createdBy: 1, updatedBy: 1 },
      ])
      .execute()
  }
}