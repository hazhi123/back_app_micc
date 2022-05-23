import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import {
  CinesCComercialesEntity,
} from '../../cines/cines/entities/cines-ccomerciales.entity';
import {
  ComentariosEntity,
} from '../../comentarios/entities/comentarios.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { LikesEntity } from '../../likes/entities/likes.entity';
import {
  TiendasCComercialesEntity,
} from '../../tiendas/entities/tiendas-ccomerciales.entity';
import {
  TiposPublicacionEntity,
} from '../../tipos-publicacion/entities/tipos-publicacion.entity';
import { FavoritosEntity } from '../../usuarios/entities/favoritos.entity';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';
import { PublicacionesGaleriaEntity } from './publicaciones-galeria.entity';

@Entity('pub_publicaciones')
export class PublicacionesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  desc: string;

  @Column({ name: 'is_permanente', type: 'bool', default: true })
  isPermanente: boolean;

  @Column({ name: 'fecha_inicio', type: 'varchar', default: '' })
  fechaInicio: string;

  @Column({ name: 'fecha_final', type: 'varchar', default: '' })
  fechaFinal: string;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_by' })
  updatedBy: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'bool', default: true })
  status: boolean;

  @Column({ name: 'link_ref', type: 'varchar', default: '' })
  linkRef: string;

  // Relaciones
  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_image' })
  image: number;

  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'id_categoria' })
  categoria: number;

  @ManyToOne(() => TiposPublicacionEntity)
  @JoinColumn({ name: 'id_tipo_pub' })
  tipoPub: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @ManyToOne(() => TiendasCComercialesEntity)
  @JoinColumn({ name: 'id_tienda_cc' })
  tiendaCC: number;

  @ManyToOne(() => CinesCComercialesEntity)
  @JoinColumn({ name: 'id_cine_cc' })
  cineCC: number;

  @ManyToOne(() => UsuariosEntity)
  @JoinColumn({ name: 'id_usuario' })
  usuarioEditor: number;

  @OneToMany(() => ComentariosEntity, com => com.publicacion)
  comentarios: ComentariosEntity[];

  @OneToMany(() => PublicacionesGaleriaEntity, pubGal => pubGal.publicacion)
  files: PublicacionesGaleriaEntity[];

  @OneToMany(() => LikesEntity, like => like.publicacion)
  likes: LikesEntity[];

  @OneToMany(() => FavoritosEntity, fov => fov.publicacion)
  favoritos: FavoritosEntity[];


}
