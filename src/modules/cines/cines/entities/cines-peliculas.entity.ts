import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import { PeliculasEntity } from '../../peliculas/entities/peliculas.entity';
import { CinesEntity } from './cines.entity';

@Entity(CONST.MODULES.CINES.CINES_PELICULAS)
export class CinesPeliculasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  //relaciones
  @ManyToOne(() => CinesEntity)
  @JoinColumn({ name: 'id_cine' })
  cine: number;

  @ManyToOne(() => PeliculasEntity)
  @JoinColumn({ name: 'id_pelicula' })
  pelicula: number;

}
