import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import {
  TiendasCComercialesEntity,
} from '../../tiendas/entities/tiendas-ccomerciales.entity';
import { ProductosGaleriaEntity } from './productos-galeria.entity';

@Entity('pro_productos')
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

  // Relaciones
  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_image' })
  image: number;

  @ManyToOne(() => TiendasCComercialesEntity)
  @JoinColumn({ name: 'id_tienda_cc' })
  tiendaCC: number;

  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'id_categoria' })
  categoria: number;

  @OneToMany(() => ProductosGaleriaEntity, proGal => proGal.producto)
  files: ProductosGaleriaEntity[];

}
