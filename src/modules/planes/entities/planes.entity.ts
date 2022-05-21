import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LicenciasEntity } from '../../licencias/entities/licencias.entity';

@Entity('plan_planes')
export class PlanesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  tipo: number; // 1 = ccomercial, 2 = tiendas, 3 = visitante

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
  costo: number;

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

  // Relaciones
  @OneToMany(() => LicenciasEntity, licencias => licencias.plan)
  licencias: LicenciasEntity[];

}
