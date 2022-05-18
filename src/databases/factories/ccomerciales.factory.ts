import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  CComercialesEntity,
} from '../../modules/ccomerciales/entities/ccomerciales.entity';

define(CComercialesEntity, (faker: typeof Faker) => {
  const ent = new CComercialesEntity();
  ent.nombre = faker.company.companyName()
  ent.desc = faker.lorem.paragraph(8);
  ent.correo = faker.internet.email();
  ent.telPrimero = faker.phone.phoneNumber();
  ent.abierto = faker.random.boolean();
  ent.direccion = faker.random.address.city();
  ent.createdBy = 1;
  ent.updatedBy = 1;
  return ent;
});