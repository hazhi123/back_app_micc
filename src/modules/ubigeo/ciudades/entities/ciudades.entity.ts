import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import { EstadosEntity } from '../../estados/entities/estados.entity';

@Entity(`${CONST.MODULES.UBIGEO.UBIGEO}_${CONST.MODULES.UBIGEO.CIU}`)
export class CiudadesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ciudad: string;

  @Column({ type: 'smallint', })
  capital: number;

  @Column({ name: 'created_by', default: 1 })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_by', default: 1 })
  updatedBy: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'bool', default: true })
  status: boolean;

  // Relaciones
  @ManyToOne(() => EstadosEntity)
  @JoinColumn({ name: 'id_edo' })
  estado: number;

}
