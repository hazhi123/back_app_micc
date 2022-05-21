import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PlanesEntity } from '../../planes/entities/planes.entity';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';

@Entity('lic_licencias')
export class LicenciasEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  licencia: string;

  @Column({ name: 'fecha_inicio', type: 'varchar' })
  fechaInicio: String;

  @Column({ name: 'fecha_final', type: 'varchar' })
  fechaFinal: String;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'is_prueba', type: 'bool', default: true })
  isPrueba: boolean;

  @Column({ name: 'is_cancelado', type: 'bool', default: false })
  isCancelado: boolean;

  //relaciones
  @OneToOne(() => UsuariosEntity, usu => usu.licencia, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_usuario' })
  usuario: any;

  @ManyToOne(() => PlanesEntity, planes => planes.licencias)
  @JoinColumn({ name: 'id_plan' })
  plan: number;

}
