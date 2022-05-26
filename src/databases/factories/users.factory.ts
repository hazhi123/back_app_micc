import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  UsuariosEntity,
} from '../../modules/usuarios/entities/usuarios.entity';

define(UsuariosEntity, (faker: typeof Faker) => {
  const user = new UsuariosEntity();
  user.nombre = faker.name.firstName();
  user.apellido = faker.name.lastName();
  user.usuario = faker.internet.email();
  user.isTrabajador = faker.random.boolean();
  user.isVisitante = faker.random.boolean();
  user.perfil = Math.floor((Math.random() * 3) + 1);
  user.createdBy = 1;
  user.updatedBy = 1;
  return user;
});