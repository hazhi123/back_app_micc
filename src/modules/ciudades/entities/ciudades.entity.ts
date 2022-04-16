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
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { PaisesEntity } from '../../paises/entities/paises.entity';

@Entity(CONST.MODULES.CIUDADES)
export class CiudadesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  nombre: string;

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
  @ManyToOne(() => PaisesEntity)
  @JoinColumn({ name: 'paises_id' })
  pais: PaisesEntity;

  @OneToMany(() => CComercialesEntity, ccomerciales => ccomerciales.ciudad)
  ccomerciales: CComercialesEntity[];

}
