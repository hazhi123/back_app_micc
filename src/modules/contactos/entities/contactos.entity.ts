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
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { MensajesEntity } from '../../mensajes/entities/mensajes.entity';
import {
  TiendasCComercialesEntity,
} from '../../tiendas/entities/tiendas-ccomerciales.entity';
import { UsersEntity } from '../../users/entities/users.entity';

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
  @JoinColumn({ name: 'id_user' })
  user: number;

  @ManyToOne(() => CComercialesEntity, users => users.contactos)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @ManyToOne(() => TiendasCComercialesEntity, users => users.contactos)
  @JoinColumn({ name: 'id_tienda_cc' })
  tiendaCC: number;

  @OneToMany(() => MensajesEntity, mensajes => mensajes.contacto)
  mensajes: MensajesEntity[];

}
