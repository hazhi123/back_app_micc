import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import {
  PerfilesModulosEntity,
} from '../../perfiles-modulos/entities/perfiles-modulos.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.USERS.PERFILES)
export class PerfilesEntity {

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
  @OneToMany(() => PerfilesModulosEntity, perfilesModulos => perfilesModulos.perfil, { eager: true })
  modulos: PerfilesModulosEntity[];

  @OneToMany(() => UsersEntity, users => users.perfil)
  users: UsersEntity[];


}
