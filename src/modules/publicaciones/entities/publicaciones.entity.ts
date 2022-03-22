import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import {
  ComentariosEntity,
} from '../../comentarios/entities/comentarios.entity';
import { LikesEntity } from '../../likes/entities/likes.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';
import {
  TiposPublicacionEntity,
} from '../../tipos-publicacion/entities/tipos-publicacion.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.PUBLICACIONES)
export class PublicacionesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  nombre: string;

  @Column({ type: 'varchar', default: '' })
  imageUrl: string;

  @Column({ type: 'varchar', default: '' })
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

  @Column("text", { array: true, default: [] })
  galeria: string[];

  @Column({ name: 'link_ref', type: 'varchar', default: '' })
  linkRef: string;

  // Relaciones
  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'categorias_id' })
  categoria: number;

  @ManyToOne(() => TiposPublicacionEntity)
  @JoinColumn({ name: 'tipo_pub_id' })
  tipoPub: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'ccomerciales_id' })
  ccomercial: number;

  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'tiendas_id' })
  tienda: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'users_id' })
  userEditor: number;

  @OneToMany(() => ComentariosEntity, comentarios => comentarios.publicacion)
  comentarios: ComentariosEntity[];

  @OneToMany(() => LikesEntity, likes => likes.publicacion)
  likes: LikesEntity[];

}
