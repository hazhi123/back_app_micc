import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  CinesCComercialesEntity,
} from '../../cines/entities/cines-ccomerciales.entity';
import { PeliculasEntity } from './peliculas.entity';

@Entity('pel_cines')
export class PeliculasCinesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  //relaciones
  @ManyToOne(() => CinesCComercialesEntity)
  @JoinColumn({ name: 'id_cine_cc' })
  cineCC: number;

  @ManyToOne(() => PeliculasEntity)
  @JoinColumn({ name: 'id_pelicula' })
  pelicula: number;

}
