import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';

@Entity(CONST.MODULES.GALERIA)
export class GaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  entidad: string;

  @Column({ name: 'ent_id', type: 'integer' })
  entId: number;

  @Column({ type: 'varchar' })
  titular: string;

  @Column({ name: 'ref_id', type: 'integer' })
  refId: number;

  @Column({ type: 'varchar' })
  file: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

}
