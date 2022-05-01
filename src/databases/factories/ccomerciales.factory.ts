import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  CComercialesEntity,
} from '../../modules/ccomerciales/entities/ccomerciales.entity';

define(CComercialesEntity, (faker: typeof Faker) => {
  const cc = new CComercialesEntity();
  cc.nombre = faker.company.companyName()
  cc.desc = faker.lorem.paragraph(8);
  cc.correo = faker.internet.email();
  cc.telPrimero = faker.phone.phoneNumber();
  cc.abierto = faker.random.boolean();
  cc.createdBy = 1;
  cc.updatedBy = 1;
  return cc;
});