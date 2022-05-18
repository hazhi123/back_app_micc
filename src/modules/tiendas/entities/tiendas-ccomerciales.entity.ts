import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as CONST from '../../../common/constants';
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { TiendasEntity } from './tiendas.entity';

@Entity(CONST.MODULES.TIENDAS.CCOMERCIALES)
export class TiendasCComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '' })
  ubicacion: string;

  //relaciones
  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  // @OneToMany(() => CinesGaleriaEntity, cg => cg.tienda)
  // files: CinesGaleriaEntity[];

  // @OneToMany(() => PanoramasEntity, p => p.cineCC)
  // panoramas: PanoramasEntity[];

}
