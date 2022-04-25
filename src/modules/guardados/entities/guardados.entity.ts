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
  PublicacionesEntity,
} from '../../publicaciones/entities/publicaciones.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.GUARDADOS)
export class GuardadosEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => UsersEntity, users => users.guardados)
  @JoinColumn({ name: 'id_user' })
  user: number;

  @ManyToOne(() => PublicacionesEntity, publicacion => publicacion.guardados)
  @JoinColumn({ name: 'id_publicacion' })
  publicacion: number;

}
