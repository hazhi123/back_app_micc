import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

import {
  CComercialesGaleriaEntity,
} from '../../modules/ccomerciales/entities/ccomerciales-galeria.entity';
import {
  CComercialesEntity,
} from '../../modules/ccomerciales/entities/ccomerciales.entity';
import { GaleriaEntity } from '../../modules/galeria/entities/galeria.entity';

export default class CComercialesSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(GaleriaEntity)()
      .map(async (gal) => {
        gal.entidad = 'ccomercial';
        gal.entId = 1;
        gal.referencia = 'ccomercial';
        gal.refId = 1;
        return gal;
      })
      .createMany(900);


    await factory(CComercialesEntity)()
      .map(async (cc) => {
        cc.ciudad = 149;
        cc.image = Math.floor((Math.random() * 900) + 1);
        cc.imageBack = Math.floor((Math.random() * 900) + 1);
        return cc;
      })
      .createMany(15);

    var data = []

    for (let index = 0; index < 9; index++) {
      data.push({
        ccomercial: 1,
        index: index,
        galeria: Math.floor((Math.random() * 900) + 1),
      });
    }

    await connection
      .createQueryBuilder()
      .insert()
      .into(CComercialesGaleriaEntity)
      .values(data)
      .execute()

  }
}