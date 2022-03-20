import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import {
  PublicacionesEntity,
} from '../../publicaciones/entities/publicaciones.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';

@Entity(CONST.MODULES.CATEGORIAS)
export class CategoriasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
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
  @OneToMany(() => TiendasEntity, tiendas => tiendas.categoria)
  tiendas: TiendasEntity[];

  @OneToMany(() => PublicacionesEntity, pub => pub.categoria)
  publicaciones: PublicacionesEntity[];
}
