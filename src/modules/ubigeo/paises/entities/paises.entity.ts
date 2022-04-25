import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import { EstadosEntity } from '../../estados/entities/estados.entity';

@Entity(`${CONST.MODULES.UBIGEO.UBIGEO}_${CONST.MODULES.UBIGEO.PAISES}`)
export class PaisesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  nombre: string;

  @Column({ default: '' })
  code: string;

  @Column({ default: '' })
  image: string;

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
  @OneToMany(() => EstadosEntity, edo => edo.pais)
  estados: EstadosEntity[];

}
