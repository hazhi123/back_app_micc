import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { PanoramasEntity } from '../../panoramas/entities/panoramas.entity';
import { ProductosEntity } from '../../productos/entities/productos.entity';
import { TiendasEntity } from './tiendas.entity';

@Entity(CONST.MODULES.TIENDAS.CCOMERCIALES)
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
  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: number;

  @OneToMany(() => PanoramasEntity, pano => pano.tiendaCC)
  panoramas: PanoramasEntity[];

  @OneToMany(() => ProductosEntity, pro => pro.tiendaCC)
  productos: ProductosEntity[];

}
