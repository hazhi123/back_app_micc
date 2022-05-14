import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { TiendasEntity } from './tiendas.entity';

@Entity(CONST.MODULES.TIENDAS.GALERIA)
export class TiendasGaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  index: number;

  //relaciones
  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  galeria: number;

}
