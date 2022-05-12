import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import { GaleriaEntity } from '../../../galeria/entities/galeria.entity';
import { CinesEntity } from './cines.entity';

@Entity(CONST.MODULES.CINES.CINES_GALERIA)
export class CinesGaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  //relaciones
  @ManyToOne(() => CinesEntity)
  @JoinColumn({ name: 'id_cine' })
  cine: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  galeria: number;

}
