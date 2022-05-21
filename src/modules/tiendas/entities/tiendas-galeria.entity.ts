import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { TiendasCComercialesEntity } from './tiendas-ccomerciales.entity';

@Entity('tie_galeria')
export class TiendasGaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  index: number;

  //relaciones
  @ManyToOne(() => TiendasCComercialesEntity)
  @JoinColumn({ name: 'id_tienda_cc' })
  tiendaCC: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  galeria: number;

}
