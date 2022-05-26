import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  PeliculasCategoriasEntity,
} from '../../modules/cines/peliculas-categorias/entities/peliculas-categorias.entity';

define(PeliculasCategoriasEntity, (faker: typeof Faker) => {
  const pro = new PeliculasCategoriasEntity();
  pro.nombre = faker.name.firstName();
  pro.desc = faker.lorem.paragraph(12);
  pro.createdBy = 1;
  pro.updatedBy = 1;
  return pro;
});