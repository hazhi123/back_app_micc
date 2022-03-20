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
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.USERS.USERS_CCOMERCIALES)
export class UsersCComercialesEntity {

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
  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'users_id' })
  user: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'ccomerciales_id' })
  ccomercial: number;

}
