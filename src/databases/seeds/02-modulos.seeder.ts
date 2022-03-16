import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import { ModulosEntity } from '../../modules/modulos/entities/modulos.entity';

export default class ModulosSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(ModulosEntity)
      .values([
        // { nombre: 'Panel de control', alias: 'panel_control', description: 'Panel de control', modulo: null, createdBy: 1, updatedBy: 1, status: true },
        // { nombre: 'Administración', alias: 'administración', description: 'Administración', modulo: null, createdBy: 1, updatedBy: 1, status: true },
      ])
      .execute()
  }
}