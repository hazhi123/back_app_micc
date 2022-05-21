import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ContactosEntity } from '../../contactos/entities/contactos.entity';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';

@Entity('chat_mensajes')
export class MensajesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  mensaje: string;

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
  @ManyToOne(() => ContactosEntity, contactos => contactos.mensajes)
  @JoinColumn({ name: 'id_contacto' })
  contacto: number;

  @ManyToOne(() => UsuariosEntity, usu => usu.mensajes)
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

}
