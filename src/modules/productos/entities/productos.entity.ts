import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';

@Entity(CONST.MODULES.PRODUCTOS)
export class ProductosEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  nombre: string;

  @Column({ type: 'varchar', default: '' })
  desc: string;

  @Column({ type: 'varchar', default: '' })
  etiqueta: string;

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

  @Column("text", { array: true, default: ['0', '0', '0', '0', '0', '0'] })
  galeria: any[];

  // Relaciones
  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  image: number;

  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: number;

  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'id_categoria' })
  categoria: number;

}
