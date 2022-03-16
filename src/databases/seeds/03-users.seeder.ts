import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import { UsersEntity } from '../../modules/users/entities/users.entity';

export default class UsersSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UsersEntity)
      .values([
        {
          nombre: 'Yordano',
          apellido: 'Hernandez',
          user: 'yordano@gmail.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 1,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
        {
          nombre: 'Editor',
          apellido: 'Editable',
          user: 'editor@gmail.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 2,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
      ])
      .execute()
  }
}