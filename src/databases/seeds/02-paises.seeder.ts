import { CategoriasEntity } from '../../modules/categorias/entities/categorias.entity';
import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';
import { PaisesEntity } from '../../modules/paises/entities/paises.entity';

export default class CategoriasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(PaisesEntity)
      .values([
        { nombre: "Venezuela", code: '+58', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Venezuela.svg/135px-Flag_of_Venezuela.svg.png' },
        { nombre: "Perú", code: '+51', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Peru.svg/135px-Flag_of_Peru.svg.png' },
        { nombre: "Argentina", code: '+54', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/135px-Flag_of_Argentina.svg.png' },
        { nombre: "Brasil", code: '+55', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/135px-Flag_of_Brazil.svg.png' },
        { nombre: "Chile", code: '+56', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Flag_of_Chile.svg/135px-Flag_of_Chile.svg.png' },
        { nombre: "Colombia", code: '+57', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/135px-Flag_of_Colombia.svg.png' },
        { nombre: "Bolivia", code: '+591', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Flag_of_Bolivia.svg/135px-Flag_of_Bolivia.svg.png' },
        { nombre: "Guyana", code: '+592', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Flag_of_Guyana.svg/135px-Flag_of_Guyana.svg.png' },
        { nombre: "Ecuador", code: '+593', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Flag_of_Ecuador.svg/135px-Flag_of_Ecuador.svg.png' },
        { nombre: "Paraguay", code: '+595', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Flag_of_Paraguay.svg/135px-Flag_of_Paraguay.svg.png' },
        { nombre: "Uruguay", code: '+598', createdBy: 1, updatedBy: 1, imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Uruguay.svg/135px-Flag_of_Uruguay.svg.png' },
      ])
      .execute()
  }
}