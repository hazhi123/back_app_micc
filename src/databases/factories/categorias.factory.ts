import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  CategoriasEntity,
} from '../../modules/categorias/entities/categorias.entity';

define(CategoriasEntity, (faker: typeof Faker) => {
  const cat = new CategoriasEntity();
  cat.nombre = faker.company.companyName()
  cat.desc = faker.lorem.paragraph(3);
  cat.createdBy = 1;
  cat.updatedBy = 1;
  return cat;
});