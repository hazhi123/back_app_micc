import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import { GaleriaEntity } from '../../../galeria/entities/galeria.entity';
import {
  CinesPeliculasEntity,
} from '../../cines/entities/cines-peliculas.entity';

@Entity(CONST.MODULES.CINES.PELICULAS)
export class PeliculasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  genero: string;

  @Column({ type: 'varchar', default: '' })
  duracion: string;

  @Column({ type: 'varchar', default: '' })
  sinopsis: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'bool', default: true })
  status: boolean;

  // Relaciones
  @OneToMany(() => CinesPeliculasEntity, cinesPelicuas => cinesPelicuas.cine)
  cines: CinesPeliculasEntity[];

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn()
  image: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn()
  imageBack: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn()
  trailer: number;

}
