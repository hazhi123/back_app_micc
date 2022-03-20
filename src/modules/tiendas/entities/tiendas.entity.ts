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
import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.TIENDAS)
export class TiendasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  correo: string;

  @Column({ name: 'tel_primero', type: 'varchar' })
  telPrimero: string;

  @Column({ name: 'tel_segundo', type: 'varchar', default: '' })
  telSegundo: string;

  @Column({ name: 'ubic_latlng', type: 'varchar' })
  ubicacion: string;

  @Column({ type: 'integer' })
  likes: number;

  @Column({ type: 'varchar', default: '' })
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

  @Column("text", { array: true })
  images: string[];

  // Relaciones
  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'categorias_id' })
  categoria: number;

  @OneToMany(() => UsersEntity, users => users.tienda)
  users: UsersEntity[];

}
