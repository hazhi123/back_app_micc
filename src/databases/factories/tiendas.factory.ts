import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { TiendasEntity } from '../../modules/tiendas/entities/tiendas.entity';

define(TiendasEntity, (faker: typeof Faker) => {
  const tie = new TiendasEntity();
  tie.nombre = faker.company.companyName()
  tie.desc = faker.lorem.paragraph(3);
  tie.correo = faker.internet.email();
  tie.telPrimero = faker.phone.phoneNumber();
  tie.abierto = faker.random.boolean();
  tie.ubicacion = faker.address.city();
  tie.createdBy = 1;
  tie.updatedBy = 1;
  return tie;
});