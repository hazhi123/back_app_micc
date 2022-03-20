import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import * as CONST from '../../../common/constants';
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

  @Column({ type: 'integer', default: 0 })
  pais: number;

  //relaciones
  @OneToOne(() => UsersEntity, users => users.informacion, { primary: true, onDelete: "CASCADE" })
  @JoinColumn({ name: 'users_id' })
  user: number;

}
