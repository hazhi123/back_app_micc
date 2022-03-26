import { CategoriasEntity } from '../../modules/categorias/entities/categorias.entity';
import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

export default class CategoriasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CategoriasEntity)
      .values([
        { nombre: "Gastronómica", desc: 'Gastronómica', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Bancos", desc: 'Bancos', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Barberías", desc: 'Barberías', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Belleza", desc: 'Belleza', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Bodegón", desc: 'Bodegón', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Diversión", desc: 'Diversión', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Estética", desc: 'Estética', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Infantil", desc: 'Infantil', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Joyería", desc: 'Joyería', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Juguetería", desc: 'Juguetería', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Moda", desc: 'Moda', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Repostería", desc: 'Repostería', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Salud", desc: 'Salud', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Servicios", desc: 'Servicios', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Tecnología", desc: 'Tecnología', createdBy: 1, updatedBy: 1, imageUrl: '' },
        { nombre: "Accesorios", desc: 'Accesorios', createdBy: 1, updatedBy: 1, imageUrl: '' },
      ])
      .execute()
  }
}