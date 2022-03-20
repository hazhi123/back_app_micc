import { ComentariosEntity } from '../../comentarios/entities/comentarios.entity';
import { LikesEntity } from '../../likes/entities/likes.entity';
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
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.PUBLICACIONES)
export class PublicacionesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  tipo: number; // 1- Historia, 2-Promocion, 3-Evento,

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  portada: string;

  @Column({ type: 'varchar', default: '' })
  desc: string;

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

  @Column("text", { array: true })
  images: string[];

  // Relaciones
  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'categorias_id' })
  categoria: number;

  @ManyToOne(() => UsersEntity)
  @JoinColumn({ name: 'users_id' })
  userEditor: number;

  @OneToMany(() => ComentariosEntity, comentarios => comentarios.publicacion)
  comentarios: ComentariosEntity[];

  @OneToMany(() => LikesEntity, likes => likes.publicacion)
  likes: LikesEntity[];

}
