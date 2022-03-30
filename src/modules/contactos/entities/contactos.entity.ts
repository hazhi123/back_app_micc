import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { UsersEntity } from '../../users/entities/users.entity';
import { CComercialesEntity } from '../../ccomerciales/entities/ccomerciales.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';
import { MensajesEntity } from '../../mensajes/entities/mensajes.entity';

@Entity(CONST.MODULES.CONTACTOS)
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
  @ManyToOne(() => UsersEntity, users => users.contactos)
  @JoinColumn({ name: 'users_id' })
  user: number;

  @ManyToOne(() => CComercialesEntity, users => users.contactos)
  @JoinColumn({ name: 'ccomerciales_id' })
  ccomercial: number;

  @ManyToOne(() => TiendasEntity, users => users.contactos)
  @JoinColumn({ name: 'tiendas_id' })
  tienda: number;

  @OneToMany(() => MensajesEntity, mensajes => mensajes.contacto)
  mensajes: MensajesEntity[];

}
