import { ContactosEntity } from '../../contactos/entities/contactos.entity';
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
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';

@Entity(CONST.MODULES.TIENDAS)
export class TiendasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', default: '' })
  correo: string;

  @Column({ name: 'tel_primero', type: 'varchar', default: '' })
  telPrimero: string;

  @Column({ name: 'tel_segundo', type: 'varchar', default: '' })
  telSegundo: string;

  @Column({ name: 'ubic_latlng', type: 'varchar' })
  ubicacion: string;

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

  @Column({ name: 'is_gastro', type: 'bool', default: false })
  isGastro: boolean;

  @Column({ name: 'image_url', default: '' })
  imageUrl: string;

  @Column("text", { array: true, default: [] })
  galeria: string[];

  // Relaciones
  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'categorias_id' })
  categoria: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'ccomerciales_id' })
  ccomercial: any;

  @OneToMany(() => ContactosEntity, categoria => categoria.tienda)
  contactos: ContactosEntity[];

}
