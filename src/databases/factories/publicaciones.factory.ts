import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  PublicacionesEntity,
} from '../../modules/publicaciones/entities/publicaciones.entity';

define(PublicacionesEntity, (faker: typeof Faker) => {
  const pub = new PublicacionesEntity();
  pub.nombre = faker.company.companyName()
  pub.desc = faker.lorem.paragraph(10);
  pub.isPermanente = true;
  pub.createdBy = 1;
  pub.updatedBy = 1;
  pub.tipoPub = Math.floor((Math.random() * 3) + 1);
  pub.userEditor = Math.floor((Math.random() * 20) + 1);
  return pub;
});