import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { PublicacionesEntity } from './publicaciones.entity';

@Entity('pub_galeria')
export class PublicacionesGaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  index: number;

  //relaciones
  @ManyToOne(() => PublicacionesEntity)
  @JoinColumn({ name: 'id_publicacion' })
  publicacion: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  galeria: number;

}
