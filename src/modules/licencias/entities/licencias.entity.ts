import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { PlanesEntity } from '../../planes/entities/planes.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.LICENCIAS)
export class LicenciasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  licencia: string;

  @Column({ name: 'fecha_inicio', type: 'varchar' })
  fechaInicio: String;

  @Column({ name: 'fecha_final', type: 'varchar' })
  fechaFinal: String;

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

  @Column({ name: 'is_gratis', type: 'bool', default: true })
  isGratis: boolean;

  //relaciones
  @OneToOne(() => UsersEntity, users => users.licencia, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_user' })
  user: UsersEntity;

  @ManyToOne(() => PlanesEntity, planes => planes.licencias)
  @JoinColumn({ name: 'id_plan' })
  plan: PlanesEntity;

}
