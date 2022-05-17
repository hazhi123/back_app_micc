import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import {
  CinesCComercialesEntity,
} from '../../cines/cines/entities/cines-ccomerciales.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';

@Entity(CONST.MODULES.PANORAMAS)
export class PanoramasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: '' })
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
  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: number;

  @ManyToOne(() => CinesCComercialesEntity)
  @JoinColumn({ name: 'id_cine_cc' })
  cineCC: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn()
  image: number;
}
