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
import { CinesGaleriaEntity } from './cines-galeria.entity';
import { CinesPeliculasEntity } from './cines-peliculas.entity';

@Entity(CONST.MODULES.CINES.CINES)
export class CinesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  ubicacion: string;

  @Column({ type: 'varchar', default: '' })
  desc: string;

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

  @Column("text", { array: true, default: ['0', '0', '0', '0', '0', '0', '0', '0', '0'] })
  galeria: any[];

  // Relaciones
  @ManyToOne(() => GaleriaEntity)
  @JoinColumn()
  image: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn()
  imageBack: number;

  @OneToMany(() => CinesPeliculasEntity, cinesPeliculas => cinesPeliculas.pelicula)
  peliculas: CinesPeliculasEntity[];

  @OneToMany(() => CinesGaleriaEntity, cine_galeria => cine_galeria.cine)
  panoramas: CinesGaleriaEntity[];

}
