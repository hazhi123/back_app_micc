import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  CComercialesEntity,
} from '../../../ccomerciales/entities/ccomerciales.entity';
import { HorariosEntity } from '../../../horarios/entities/horarios.entity';
import { LikesEntity } from '../../../likes/entities/likes.entity';
import { PanoramasEntity } from '../../../panoramas/entities/panoramas.entity';
import {
  PeliculasCinesEntity,
} from '../../peliculas/entities/peliculas-cines.entity';
import { CinesGaleriaEntity } from './cines-galeria.entity';
import { CinesEntity } from './cines.entity';

@Entity('cin_ccomerciales')
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

  @OneToOne(() => HorariosEntity, hor => hor.cineCC, { eager: true })
  horarios: HorariosEntity[];

  @OneToMany(() => LikesEntity, likes => likes.cineCC)
  likes: LikesEntity[];
}
