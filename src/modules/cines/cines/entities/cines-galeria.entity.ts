import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import {
  CComercialesCinesEntity,
} from '../../../ccomerciales/entities/ccomerciales-cines.entity';
import { GaleriaEntity } from '../../../galeria/entities/galeria.entity';

@Entity(CONST.MODULES.CINES.CINES_GALERIA)
export class CinesGaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  index: number;

  //relaciones
  @ManyToOne(() => CComercialesCinesEntity)
  @JoinColumn({ name: 'id_cine' })
  cine: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  galeria: number;

}
