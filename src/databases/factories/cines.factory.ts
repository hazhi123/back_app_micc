import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { CinesEntity } from '../../modules/cines/cines/entities/cines.entity';

define(CinesEntity, (faker: typeof Faker) => {
  const ent = new CinesEntity();
  ent.nombre = faker.company.companyName()
  ent.ubicacion = faker.address.city();
  ent.desc = faker.lorem.paragraph(5);
  ent.createdBy = 1;
  ent.updatedBy = 1;
  return ent;
});