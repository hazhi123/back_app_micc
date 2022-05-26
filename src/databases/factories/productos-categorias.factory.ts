import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  ProductosCategoriasEntity,
} from '../../modules/productos-categorias/entities/productos-categorias.entity';

define(ProductosCategoriasEntity, (faker: typeof Faker) => {
  const pro = new ProductosCategoriasEntity();
  pro.nombre = faker.commerce.product()
  pro.desc = faker.lorem.paragraph(12);
  pro.createdBy = 1;
  pro.updatedBy = 1;
  return pro;
});