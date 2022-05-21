import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  CinesCComercialesEntity,
} from '../../cines/cines/entities/cines-ccomerciales.entity';
import {
  PublicacionesEntity,
} from '../../publicaciones/entities/publicaciones.entity';
import {
  TiendasCComercialesEntity,
} from '../../tiendas/entities/tiendas-ccomerciales.entity';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';

@Entity('usu_likes')
export class LikesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => UsuariosEntity)
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

  @ManyToOne(() => PublicacionesEntity)
  @JoinColumn({ name: 'id_publicacion' })
  publicacion: any;

  @ManyToOne(() => TiendasCComercialesEntity)
  @JoinColumn({ name: 'id_tienda_cc' })
  tiendaCC: any;

  @ManyToOne(() => CinesCComercialesEntity)
  @JoinColumn({ name: 'id_cine_cc' })
  cineCC: any;

}
