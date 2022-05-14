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
import {
  CComercialesCinesEntity,
} from '../../../ccomerciales/entities/ccomerciales-cines.entity';
import {
  CComercialesEntity,
} from '../../../ccomerciales/entities/ccomerciales.entity';
import { GaleriaEntity } from '../../../galeria/entities/galeria.entity';
import { CinesGaleriaEntity } from './cines-galeria.entity';
import { CinesPeliculasEntity } from './cines-peliculas.entity';

@Entity(CONST.MODULES.CINES.CINES)
export class CinesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

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

  // Relaciones
  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_image' })
  image: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_back' })
  imageBack: number;

  @OneToMany(() => CinesPeliculasEntity, cinesPeliculas => cinesPeliculas.pelicula)
  funciones: CinesPeliculasEntity[];

  @OneToMany(() => CinesGaleriaEntity, cine_galeria => cine_galeria.cine)
  panoramas: CinesGaleriaEntity[];

  @OneToMany(() => CComercialesCinesEntity, cineCC => cineCC.cine)
  ccomerciales: CComercialesEntity[];

}
