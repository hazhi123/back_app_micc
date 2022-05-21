import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EstadosEntity } from '../../estados/entities/estados.entity';

@Entity(`ubigeo_ciudades`)
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
