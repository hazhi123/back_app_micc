import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { ContactosEntity } from '../../contactos/entities/contactos.entity';
import { HorariosEntity } from '../../horarios/entities/horarios.entity';
import { LikesEntity } from '../../likes/entities/likes.entity';
import { PanoramasEntity } from '../../panoramas/entities/panoramas.entity';
import { ProductosEntity } from '../../productos/entities/productos.entity';
import {
  PublicacionesEntity,
} from '../../publicaciones/entities/publicaciones.entity';
import { FavoritosEntity } from '../../usuarios/entities/favoritos.entity';
import { TiendasGaleriaEntity } from './tiendas-galeria.entity';
import { TiendasEntity } from './tiendas.entity';

@Entity('tie_ccomerciales')
export class TiendasCComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  correo: string;

  @Column('text', { array: true, nullable: true })
  telefonos: string[];

  @Column({ type: 'varchar', default: '' })
  ubicacion: string;

  @Column({ type: 'bool', default: true })
  abierto: boolean;

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

  //relaciones
  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: any;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: any;

  @ManyToOne(() => CategoriasEntity)
  @JoinColumn({ name: 'id_categoria' })
  categoria: number;

  @OneToMany(() => TiendasGaleriaEntity, cg => cg.tiendaCC)
  files: TiendasGaleriaEntity[];

  @OneToMany(() => PanoramasEntity, pano => pano.tiendaCC)
  panoramas: PanoramasEntity[];

  @OneToMany(() => ProductosEntity, pro => pro.tiendaCC)
  productos: ProductosEntity[];

  @OneToMany(() => ContactosEntity, categoria => categoria.tiendaCC)
  contactos: ContactosEntity[];

  @OneToOne(() => HorariosEntity, horarios => horarios.tiendaCC, { eager: true })
  horarios: HorariosEntity;

  @OneToMany(() => LikesEntity, likes => likes.tiendaCC)
  likes: LikesEntity[];

  @OneToMany(() => FavoritosEntity, fav => fav.tiendaCC)
  favoritos: FavoritosEntity[];

  @OneToMany(() => PublicacionesEntity, pub => pub.tiendaCC)
  publicaciones: PublicacionesEntity[];

}
