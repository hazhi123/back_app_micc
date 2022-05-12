import * as Faker from 'faker';
import { define } from 'typeorm-seeding';

import { GaleriaEntity } from '../../modules/galeria/entities/galeria.entity';

define(GaleriaEntity, (faker: typeof Faker) => {
  const ent = new GaleriaEntity();
  ent.file = `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${Math.floor((Math.random() * 990) + 1)}.jpg`;
  return ent;
});