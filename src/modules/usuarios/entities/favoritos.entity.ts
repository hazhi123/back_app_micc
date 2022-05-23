import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  PublicacionesEntity,
} from '../../publicaciones/entities/publicaciones.entity';
import {
  TiendasCComercialesEntity,
} from '../../tiendas/entities/tiendas-ccomerciales.entity';
import { UsuariosEntity } from './usuarios.entity';

@Entity('usu_favoritos')
export class FavoritosEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => UsuariosEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: number;

  @ManyToOne(() => PublicacionesEntity, publicacion => publicacion.favoritos)
  @JoinColumn({ name: 'id_publicacion' })
  publicacion: number;

  @ManyToOne(() => TiendasCComercialesEntity, tieCC => tieCC.favoritos)
  @JoinColumn({ name: 'id_tienda_cc' })
  tiendaCC: number;

}
