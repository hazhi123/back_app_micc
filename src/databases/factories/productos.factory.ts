import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  ProductosEntity,
} from '../../modules/productos/entities/productos.entity';

define(ProductosEntity, (faker: typeof Faker) => {
  const pro = new ProductosEntity();
  pro.nombre = faker.commerce.product()
  pro.desc = faker.lorem.paragraph(12);
  pro.etiqueta = faker.name.firstName();
  pro.createdBy = 1;
  pro.updatedBy = 1;
  return pro;
});