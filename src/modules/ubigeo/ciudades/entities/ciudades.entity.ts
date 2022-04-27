import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../../common/constants';
import { EstadosEntity } from '../../estados/entities/estados.entity';

@Entity(`${CONST.MODULES.UBIGEO.UBIGEO}_${CONST.MODULES.UBIGEO.CIU}`)
export class CiudadesEntity {

  @PrimaryGeneratedColumn({ name: 'id_ciudad' })
  id: number;

  @Column()
  ciudad: string;

  @Column({ type: 'smallint', })
  capital: number;

  // Relaciones
  @ManyToOne(() => EstadosEntity)
  @JoinColumn({ name: 'id_estado' })
  estado: number;

}
