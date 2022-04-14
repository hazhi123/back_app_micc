import { CComercialesEntity } from '../../ccomerciales/entities/ccomerciales.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';

@Entity(CONST.MODULES.HORARIOS)
export class HorariosEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  lunes: string;

  @Column({ type: 'varchar', default: '' })
  martes: string;

  @Column({ type: 'varchar', default: '' })
  miercoles: string;

  @Column({ type: 'varchar', default: '' })
  jueves: string;

  @Column({ type: 'varchar', default: '' })
  viernes: string;

  @Column({ type: 'varchar', default: '' })
  sabado: string;

  @Column({ type: 'varchar', default: '' })
  domingo: string;

  @Column({ type: 'varchar', default: '' })
  feriados: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar' })
  entidad: string;

  // Relaciones
  @OneToOne(() => CComercialesEntity, cc => cc.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ccomercial_id' })
  ccomercial: number;

  @OneToOne(() => TiendasEntity, tienda => tienda.horarios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tiendas_id' })
  tienda: number;

}
