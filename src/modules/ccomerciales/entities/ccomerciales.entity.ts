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
import { PaisesEntity } from '../../paises/entities/paises.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.CCOMERCIALES)
export class CComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', default: '' })
  correo: string;

  @Column({ name: 'tel_primero', type: 'varchar' })
  telPrimero: string;

  @Column({ name: 'tel_segundo', type: 'varchar', default: '' })
  telSegundo: string;

  @Column({ type: 'varchar', default: '' })
  ciudad: string;

  @Column({ type: 'varchar', default: '' })
  direccion: string;

  @Column({ name: 'ubic_latlng', type: 'varchar', default: '' })
  ubicLatLng: string;

  @Column({ type: 'varchar', default: '' })
  horarios: string;

  @Column({ type: 'integer', default: 0 })
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

  @Column({ type: 'varchar', default: '' })
  imageUrl: string;

  @Column("text", { array: true, default: [] })
  galeria: string[];

  // Relaciones
  @OneToMany(() => UsersEntity, users => users.ccomercial)
  users: UsersEntity[];

  @ManyToOne(() => PaisesEntity, paises => paises.ccomerciales)
  @JoinColumn({ name: 'paises_id' })
  pais: number;

}
