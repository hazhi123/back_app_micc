import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import * as CONST from '../../../common/constants';
import {
  CinesGaleriaEntity,
} from '../../cines/cines/entities/cines-galeria.entity';
import { CinesEntity } from '../../cines/cines/entities/cines.entity';
import { CComercialesEntity } from './ccomerciales.entity';

@Entity(CONST.MODULES.CCOMERCIALES.CINES)
export class CComercialesCinesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ubicacion: string;

  //relaciones
  @ManyToOne(() => CinesEntity)
  @JoinColumn({ name: 'id_cine' })
  cine: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @OneToMany(() => CinesGaleriaEntity, cineGal => cineGal.cine)
  files: CinesGaleriaEntity[];

}
