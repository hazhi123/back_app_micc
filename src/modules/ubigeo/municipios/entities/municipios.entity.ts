import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EstadosEntity } from '../../estados/entities/estados.entity';
import { ParroquiasEntity } from '../../parroquias/entities/parroquias.entity';

@Entity('ubigeo_municipios')
export class MunicipiosEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  municipio: string;

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
  @ManyToOne(() => EstadosEntity)
  @JoinColumn({ name: 'id_estado' })
  estado: number;

  @OneToMany(() => ParroquiasEntity, parr => parr.municipio)
  parroquias: ParroquiasEntity[];

}
