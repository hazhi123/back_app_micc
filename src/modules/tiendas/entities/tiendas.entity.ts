import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { ContactosEntity } from '../../contactos/entities/contactos.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { HorariosEntity } from '../../horarios/entities/horarios.entity';
import { ProductosEntity } from '../../productos/entities/productos.entity';

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

  @Column({ type: 'bool', default: true })
  abierto: boolean;

  @Column({ name: 'is_gastro', type: 'bool', default: false })
  isGastro: boolean;

  @Column("text", { array: true, default: ['0', '0', '0', '0', '0', '0', '0', '0', '0'] })
  galeria: any[];

  // Relaciones
  @OneToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  image: number;

  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'id_categoria' })
  categoria: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: any;

  @OneToMany(() => ContactosEntity, categoria => categoria.tienda)
  contactos: ContactosEntity[];

  @OneToOne(() => HorariosEntity, horarios => horarios.tienda, { eager: true })
  horarios: number;

  @OneToMany(() => ProductosEntity, productos => productos.tienda)
  productos: ProductosEntity[];

}
