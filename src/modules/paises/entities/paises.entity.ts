import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.PAISES)
export class PaisesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  nombre: string;

  @Column({ default: '' })
  code: string;

  @Column({ default: '' })
  imageUrl: string;

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
  @OneToMany(() => CComercialesEntity, ccomerciales => ccomerciales.pais)
  ccomerciales: CComercialesEntity[];

  @OneToMany(() => UsersEntity, users => users.pais)
  users: UsersEntity[];

}
