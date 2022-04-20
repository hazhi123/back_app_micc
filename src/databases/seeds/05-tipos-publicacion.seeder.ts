import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  TiposPublicacionEntity,
} from '../../modules/tipos-publicacion/entities/tipos-publicacion.entity';

export default class TiposPublicacionSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(TiposPublicacionEntity)
      .values([
        { nombre: 'Noticia', desc: 'Noticia', createdBy: 1, updatedBy: 1 },
        { nombre: 'Promoción', desc: 'Promoción', createdBy: 1, updatedBy: 1 },
        { nombre: 'Evento', desc: 'Evento', createdBy: 1, updatedBy: 1 },
        { nombre: 'Borrador', desc: 'Borrador', createdBy: 1, updatedBy: 1 },
      ])
      .execute()
  }
}