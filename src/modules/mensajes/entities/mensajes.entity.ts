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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => ContactosEntity, contactos => contactos.mensajes)
  @JoinColumn({ name: 'id_contacto' })
  contacto: number;

  @ManyToOne(() => UsuariosEntity, usu => usu.mensajes)
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

}
