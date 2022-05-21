import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { ContactosEntity } from '../../contactos/entities/contactos.entity';
import { HorariosEntity } from '../../horarios/entities/horarios.entity';
import { LikesEntity } from '../../likes/entities/likes.entity';
import { PanoramasEntity } from '../../panoramas/entities/panoramas.entity';
import { ProductosEntity } from '../../productos/entities/productos.entity';
import { TiendasGaleriaEntity } from './tiendas-galeria.entity';
import { TiendasEntity } from './tiendas.entity';

@Entity('tie_ccomerciales')
export class TiendasCComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  correo: string;

  @Column({ name: 'tel_primero', type: 'varchar', default: '' })
  telPrimero: string;

  @Column({ name: 'tel_segundo', type: 'varchar', default: '' })
  telSegundo: string;

  @Column({ type: 'varchar', default: '' })
  ubicacion: string;

  @Column({ type: 'bool', default: true })
  abierto: boolean;

  //relaciones
  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @OneToMany(() => TiendasGaleriaEntity, cg => cg.tiendaCC)
  files: TiendasGaleriaEntity[];

  @OneToMany(() => PanoramasEntity, pano => pano.tiendaCC)
  panoramas: PanoramasEntity[];

  @OneToMany(() => ProductosEntity, pro => pro.tiendaCC)
  productos: ProductosEntity[];

  @OneToMany(() => ContactosEntity, categoria => categoria.tiendaCC)
  contactos: ContactosEntity[];

  @OneToOne(() => HorariosEntity, horarios => horarios.tiendaCC, { eager: true })
  horarios: number;

  @OneToMany(() => LikesEntity, likes => likes.tiendaCC)
  likes: LikesEntity[];

}
