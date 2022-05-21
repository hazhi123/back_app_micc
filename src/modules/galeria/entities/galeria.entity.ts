import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gal_galeria')
export class GaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  entidad: string;

  @Column({ name: 'id_ent', type: 'integer', default: 0 })
  entId: number;

  @Column({ type: 'varchar' })
  referencia: string;

  @Column({ name: 'id_ref', type: 'integer' })
  refId: number;

  @Column({ type: 'varchar' })
  file: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

}
