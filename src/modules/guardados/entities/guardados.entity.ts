import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  PublicacionesEntity,
} from '../../publicaciones/entities/publicaciones.entity';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';

@Entity('gua_guardados')
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
  @ManyToOne(() => UsuariosEntity, usu => usu.guardados)
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

  @ManyToOne(() => PublicacionesEntity, publicacion => publicacion.guardados)
  @JoinColumn({ name: 'id_publicacion' })
  publicacion: number;

}
