import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  PerfilesEntity,
} from '../../modules/perfiles/entities/perfiles.entity';

export default class PerfilesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(PerfilesEntity)
      .values([
        { nombre: 'Administrador', desc: 'Control total del sistema', createdBy: 1, updatedBy: 1, status: true },
        { nombre: 'Centro Comercial', desc: 'Registra informacion sobre el Centro Comercial', createdBy: 1, updatedBy: 1, status: true },
        { nombre: 'Tienda', desc: 'Registra informacion sobre la Tienda', createdBy: 1, updatedBy: 1, status: true },
        { nombre: 'Visitante', desc: 'Solo consume datos', createdBy: 1, updatedBy: 1, status: true },
      ])
      .execute()
  }
}