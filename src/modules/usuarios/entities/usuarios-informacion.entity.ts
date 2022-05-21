import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import {
  ParroquiasEntity,
} from '../../ubigeo/parroquias/entities/parroquias.entity';
import { UsuariosEntity } from './usuarios.entity';

@Entity('usu_informacion')
export class UsuariosInformacionEntity {

  @Column({ type: 'varchar', default: '' })
  dni: string;

  @Column({ type: 'varchar', default: '' })
  celular: string;

  @Column({ type: 'varchar', default: '' })
  direccion: string;

  @Column({ type: 'varchar', default: '' })
  correo: string;

  @Column({ type: 'varchar', default: '' })
  telefono: string;

  //relaciones
  @OneToOne(() => UsuariosEntity, usu => usu.informacion, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

  @ManyToOne(() => ParroquiasEntity)
  @JoinColumn({ name: 'id_parroquia' })
  parroquia: number;

}
