import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { ModulosEntity } from '../../modulos/entities/modulos.entity';
import { PerfilesEntity } from '../../perfiles/entities/perfiles.entity';

@Entity(CONST.MODULES.USERS.PERFILES_MODULOS)
export class PerfilesModulosEntity {

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
  @ManyToOne(() => PerfilesEntity, perfiles => perfiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_perfil' })
  perfil: number;

  @ManyToOne(() => ModulosEntity, modulos => modulos)
  @JoinColumn({ name: 'id_modulo' })
  modulo: number;

}
