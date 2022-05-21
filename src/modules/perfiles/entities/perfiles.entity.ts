import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  PerfilesModulosEntity,
} from '../../perfiles-modulos/entities/perfiles-modulos.entity';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';

@Entity('usu_perfiles')
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

  @OneToMany(() => UsuariosEntity, usu => usu.perfil)
  usuarios: UsuariosEntity[];


}
