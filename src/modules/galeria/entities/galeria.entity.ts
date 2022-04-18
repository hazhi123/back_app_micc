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

  @Column({ type: 'varchar', default: '' })
  entidad: string;

  @Column({ name: 'ent_id', type: 'integer', default: 0 })
  entId: number;

  @Column({ type: 'varchar' })
  referencia: string;

  @Column({ name: 'ref_id', type: 'integer' })
  refId: number;

  @Column({ type: 'varchar' })
  file: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

}
