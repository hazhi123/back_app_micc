import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import {
  CComercialesEntity,
} from '../../../ccomerciales/entities/ccomerciales.entity';
import { PanoramasEntity } from '../../../panoramas/entities/panoramas.entity';
import {
  PeliculasCinesEntity,
} from '../../peliculas/entities/peliculas-cines.entity';
import { CinesGaleriaEntity } from './cines-galeria.entity';
import { CinesEntity } from './cines.entity';

@Entity(CONST.MODULES.CINES.CCOMERCIALES)
export class CinesCComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  ubicacion: string;

  //relaciones
  @ManyToOne(() => CinesEntity)
  @JoinColumn({ name: 'id_cine' })
  cine: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @OneToMany(() => CinesGaleriaEntity, cg => cg.cinesCC)
  files: CinesGaleriaEntity[];

  @OneToMany(() => PanoramasEntity, p => p.cineCC)
  panoramas: PanoramasEntity[];

  @OneToMany(() => PeliculasCinesEntity, cp => cp.cineCC)
  peliculas: PeliculasCinesEntity[];

}
