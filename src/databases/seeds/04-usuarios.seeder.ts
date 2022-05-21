import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  UsuariosEntity,
} from '../../modules/usuarios/entities/usuarios.entity';

export default class UsuariosSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UsuariosEntity)
      .values([
        {
          nombre: 'Admin',
          apellido: 'Administrador',
          usuario: 'admin@admin.com',
          contrasena: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
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
          usuario: 'ccomercial@ccomercial.com',
          contrasena: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
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
          usuario: 'tienda@tienda.com',
          contrasena: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
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
          nombre: 'Cine',
          apellido: 'Cine',
          usuario: 'cine@cine.com',
          contrasena: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
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
          usuario: 'visitante@visitante.com',
          contrasena: '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi',
          perfil: 5,
          ciudad: 149,
          createdBy: 1,
          updatedBy: 1,
          status: true
        },
      ])
      .execute()

    await factory(UsuariosEntity)()
      .map(async (user) => {
        user.ccomercial = 1;
        user.contrasena = '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi';
        user.ciudad = 149;
        user.image = Math.floor((Math.random() * 900) + 1);
        user.imageBack = Math.floor((Math.random() * 900) + 1);
        return user;
      })
      .createMany(100);

    await factory(UsuariosEntity)()
      .map(async (user) => {
        user.ccomercial = 1;
        user.contrasena = '$2b$10$BV0NRhnxZXkjKwiNu8IbJOFRXh4Q8BsoY/qLaEv9lw0/4ct.AemAi';
        user.tienda = Math.floor((Math.random() * 60) + 1);
        user.ciudad = 149;
        user.image = Math.floor((Math.random() * 900) + 1);
        user.imageBack = Math.floor((Math.random() * 900) + 1);
        return user;
      })
      .createMany(100);
  }
}