import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import {
  CComercialesEntity,
} from '../../../ccomerciales/entities/ccomerciales.entity';
import { CinesEntity } from './cines.entity';

@Entity(CONST.MODULES.CINES.CINES_CCOMERCIALES)
export class CinesCComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  //relaciones
  @ManyToOne(() => CinesEntity)
  @JoinColumn({ name: 'id_cine' })
  cine: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

}
