import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import { CiudadesEntity } from '../../ciudades/entities/ciudades.entity';
import { MunicipiosEntity } from '../../municipios/entities/municipios.entity';
import { PaisesEntity } from '../../paises/entities/paises.entity';

@Entity(`${CONST.MODULES.UBIGEO.UBIGEO}_${CONST.MODULES.UBIGEO.EDO}`)
export class EstadosEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
  @JoinColumn({ name: 'id_pais' })
  pais: number;

  @OneToMany(() => MunicipiosEntity, mcpio => mcpio.estado)
  municipios: MunicipiosEntity[];

  @OneToMany(() => CiudadesEntity, ciu => ciu.estado)
  ciudades: CiudadesEntity[];

}
