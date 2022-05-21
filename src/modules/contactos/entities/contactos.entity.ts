import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MensajesEntity } from '../../mensajes/entities/mensajes.entity';
import {
  TiendasCComercialesEntity,
} from '../../tiendas/entities/tiendas-ccomerciales.entity';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';

@Entity('chat_contactos')
export class ContactosEntity {

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

  @Column({ type: 'bool', default: true })
  status: boolean;

  @Column({ type: 'varchar', default: '' })
  ultimoMensaje: string;

  // Relaciones
  @ManyToOne(() => UsuariosEntity, usu => usu.contactos)
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

  @ManyToOne(() => TiendasCComercialesEntity, tieCC => tieCC.contactos)
  @JoinColumn({ name: 'id_tienda_cc' })
  tiendaCC: number;

  @OneToMany(() => MensajesEntity, mensajes => mensajes.contacto)
  mensajes: MensajesEntity[];

}
