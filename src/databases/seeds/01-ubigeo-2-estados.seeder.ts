import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  EstadosEntity,
} from '../../modules/ubigeo/estados/entities/estados.entity';

export default class UbigeoEstadosSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {

    // Estados - Venezuela
    await connection
      .createQueryBuilder()
      .insert()
      .into(EstadosEntity)
      .values([
        { nombre: 'Amazonas', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Anzoátegui', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Apure', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Aragua', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Barinas', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Bolívar', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Carabobo', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Cojedes', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Delta Amacuro', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Falcón', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Guárico', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Lara', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Mérida', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Miranda', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Monagas', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Nueva Esparta', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Portuguesa', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Sucre', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Táchira', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Trujillo', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'La Guaira', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Yaracuy', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Zulia', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Distrito Capital', createdBy: 1, updatedBy: 1, idPais: 1 },
        { nombre: 'Dependencias Federales', createdBy: 1, updatedBy: 1, idPais: 1 },
      ])
      .execute()
  }
}