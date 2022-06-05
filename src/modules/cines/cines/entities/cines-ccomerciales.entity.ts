import {
  Column,
  CreateDateColumn,
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
  PublicacionesEntity,
} from '../../../publicaciones/entities/publicaciones.entity';
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

  @Column({ type: 'varchar', default: '' })
  correo: string;

  @Column('text', { array: true, nullable: true })
  telefonos: string[];

  @Column({ type: 'bool', default: true })
  abierto: boolean;

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

  @OneToMany(() => PublicacionesEntity, pub => pub.cineCC)
  publicaciones: PublicacionesEntity[];
}
