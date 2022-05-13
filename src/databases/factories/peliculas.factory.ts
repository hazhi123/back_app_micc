import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import {
  PeliculasEntity,
} from '../../modules/cines/peliculas/entities/peliculas.entity';

define(PeliculasEntity, (faker: typeof Faker) => {
  const ent = new PeliculasEntity();
  ent.nombre = faker.company.companyName()
  ent.genero = faker.name.firstName();
  ent.duracion = `${Math.floor((Math.random() * 999) + 1)} Min`
  ent.sinopsis = faker.lorem.paragraph(5);
  ent.createdBy = 1;
  ent.updatedBy = 1;
  return ent;
});