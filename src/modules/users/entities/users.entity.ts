import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { LicenciasEntity } from '../../licencias/entities/licencias.entity';
import { PerfilesEntity } from '../../perfiles/entities/perfiles.entity';
import {
  UsersInformacionEntity,
} from './users-informacion.entity';

@Entity(CONST.MODULES.USERS.USERS)
export class UsersEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  apellido: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  user: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

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

  @Column({ type: 'varchar', default: '' })
  image: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return
    this.password = await bcrypt.hash(this.password, 10)
  }

  // Relaciones 
  @ManyToOne(() => PerfilesEntity)
  @JoinColumn({ name: 'perfiles_id' })
  perfil: number;

  @OneToOne(() => UsersInformacionEntity, informacion => informacion.user, { eager: true })
  informacion: UsersInformacionEntity;

  @OneToOne(() => LicenciasEntity, licencias => licencias.user, { eager: true })
  licencia: LicenciasEntity;

}

