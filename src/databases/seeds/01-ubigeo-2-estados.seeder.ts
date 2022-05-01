import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

export default class UbigeoEstadosSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // Estados - Venezuela
    // await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(EstadosEntity)
    //   .values([
    //     { estado: 'Amazonas', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Anzoátegui', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Apure', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Aragua', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Barinas', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Bolívar', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Carabobo', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Cojedes', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Delta Amacuro', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Falcón', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Guárico', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Lara', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Mérida', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Miranda', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Monagas', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Nueva Esparta', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Portuguesa', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Sucre', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Táchira', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Trujillo', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'La Guaira', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Yaracuy', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Zulia', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Distrito Capital', createdBy: 1, updatedBy: 1, pais: 1 },
    //     { estado: 'Dependencias Federales', createdBy: 1, updatedBy: 1, pais: 1 },
    //   ])
    //   .execute()
  }
}