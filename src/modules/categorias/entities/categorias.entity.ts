import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import {
  PublicacionesEntity,
} from '../../publicaciones/entities/publicaciones.entity';
import {
  TiendasCComercialesEntity,
} from '../../tiendas/entities/tiendas-ccomerciales.entity';

@Entity('cco_categorias')
export class CategoriasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ default: '' })
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

  // Relaciones
  @ManyToOne(() => CComercialesEntity, cc => cc.categorias)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @OneToMany(() => TiendasCComercialesEntity, tie => tie.categoria)
  tiendas: TiendasCComercialesEntity[];

  @OneToMany(() => PublicacionesEntity, pub => pub.categoria)
  publicaciones: PublicacionesEntity[];

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn()
  image: number;
}
