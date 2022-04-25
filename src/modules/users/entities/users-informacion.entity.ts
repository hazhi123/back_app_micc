import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import {
  ParroquiasEntity,
} from '../../ubigeo/parroquias/entities/parroquias.entity';
import { UsersEntity } from './users.entity';

@Entity(CONST.MODULES.USERS.USERS_INFORMACION)
export class UsersInformacionEntity {

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
  @OneToOne(() => UsersEntity, users => users.informacion, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_user' })
  user: number;

  @ManyToOne(() => ParroquiasEntity)
  @JoinColumn({ name: 'id_parroquia' })
  parroquia: number;

}
