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
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { GuardadosEntity } from '../../guardados/entities/guardados.entity';
import { LikesEntity } from '../../likes/entities/likes.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';
import {
  TiposPublicacionEntity,
} from '../../tipos-publicacion/entities/tipos-publicacion.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { PublicacionesGaleriaEntity } from './publicaciones-galeria.entity';

@Entity(CONST.MODULES.PUBLICACIONES)
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

  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'id_user' })
  userEditor: number;

  @OneToMany(() => ComentariosEntity, comentarios => comentarios.publicacion, { eager: true })
  comentarios: ComentariosEntity[];

  @OneToMany(() => LikesEntity, likes => likes.publicacion, { eager: true })
  likes: LikesEntity[];

  @OneToMany(() => GuardadosEntity, guardados => guardados.publicacion)
  guardados: GuardadosEntity[];

  @OneToMany(() => PublicacionesGaleriaEntity, pubGal => pubGal.publicacion)
  files: PublicacionesGaleriaEntity[];

}
