import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { UsuariosEntity } from './usuarios.entity';

@Entity('usu_ccomerciales')
export class UsuariosCComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  // Relaciones
  @ManyToOne(() => UsuariosEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

}
