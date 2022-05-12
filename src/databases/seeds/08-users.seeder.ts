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
          nombre: 'Admin',
          apellido: 'Administrador',
          user: 'admin@admin.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 1,
          ciudad: 149,
          isVisitante: false,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
        {
          nombre: 'Centro',
          apellido: 'Comercial',
          user: 'cc@ccomercial.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 2,
          ciudad: 149,
          isVisitante: false,
          ccomercial: 1,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
        {
          nombre: 'Editor',
          apellido: 'Tienda',
          user: 't@tienda.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 3,
          ciudad: 149,
          isVisitante: false,
          ccomercial: 1,
          tienda: 1,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
        {
          nombre: 'Visitante',
          apellido: 'Visita',
          user: 'visitante@gmail.com',
          password: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 4,
          ciudad: 149,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
      ])
      .execute()

    await factory(UsersEntity)()
      .map(async (user) => {
        user.ccomercial = 1;
        user.password = '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi';
        user.ciudad = 149;
        user.image = Math.floor((Math.random() * 900) + 1);
        user.imageBack = Math.floor((Math.random() * 900) + 1);
        return user;
      })
      .createMany(343);

    await factory(UsersEntity)()
      .map(async (user) => {
        user.ccomercial = 1;
        user.password = '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi';
        user.tienda = Math.floor((Math.random() * 59) + 1);
        user.ciudad = 149;
        user.image = Math.floor((Math.random() * 900) + 1);
        user.imageBack = Math.floor((Math.random() * 900) + 1);
        return user;
      })
      .createMany(245);
  }
}