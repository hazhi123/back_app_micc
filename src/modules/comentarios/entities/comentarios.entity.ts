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

@Entity('pub_comentarios')
export class ComentariosEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  comentario: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => UsuariosEntity)
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

  @ManyToOne(() => PublicacionesEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_publicacion' })
  publicacion: any;

}
