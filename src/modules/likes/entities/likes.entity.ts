import { PublicacionesEntity } from '../../publicaciones/entities/publicaciones.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.LIKES)
export class LikesEntity {

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
  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'users_id' })
  user: number;

  @ManyToOne(() => PublicacionesEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'publicaciones_id' })
  publicacion: any;

}
