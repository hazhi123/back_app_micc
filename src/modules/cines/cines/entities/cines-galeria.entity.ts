import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GaleriaEntity } from '../../../galeria/entities/galeria.entity';
import { CinesCComercialesEntity } from './cines-ccomerciales.entity';

@Entity('cin_galeria')
export class CinesGaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  index: number;

  //relaciones
  @ManyToOne(() => CinesCComercialesEntity)
  @JoinColumn({ name: 'id_cine_cc' })
  cinesCC: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  galeria: number;

}
