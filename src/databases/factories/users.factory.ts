import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { UsersEntity } from '../../modules/users/entities/users.entity';

define(UsersEntity, (faker: typeof Faker) => {
  const user = new UsersEntity();
  user.nombre = faker.name.firstName();
  user.apellido = faker.name.lastName();
  user.user = faker.internet.email();
  user.isTrabajaTienda = faker.random.boolean();
  user.isVisitante = faker.random.boolean();
  user.perfil = Math.floor((Math.random() * 3) + 1);
  user.createdBy = 1;
  user.updatedBy = 1;
  return user;
});