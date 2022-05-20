import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { UsersEntity } from './users.entity';

@Entity(CONST.MODULES.USERS.USERS_CCOMERCIALES)
export class UsersCComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  // Relaciones
  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

}
