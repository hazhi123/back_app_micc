import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { CComercialesEntity } from './ccomerciales.entity';

@Entity(CONST.MODULES.CCOMERCIALES_GALERIA)
export class CComercialesGaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  index: number;

  //relaciones
  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  galeria: number;

}
