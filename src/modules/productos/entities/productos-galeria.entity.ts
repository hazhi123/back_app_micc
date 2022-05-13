import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { ProductosEntity } from './productos.entity';

@Entity(CONST.MODULES.PRODUCTOS_GALERIA)
export class ProductosGaleriaEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  index: number;

  //relaciones
  @ManyToOne(() => ProductosEntity)
  @JoinColumn({ name: 'id_producto' })
  producto: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria' })
  galeria: number;

}
