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
  CinesCComercialesEntity,
} from '../../cines/cines/entities/cines-ccomerciales.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { HorariosEntity } from '../../horarios/entities/horarios.entity';
import {
  TiendasCComercialesEntity,
} from '../../tiendas/entities/tiendas-ccomerciales.entity';
import { CiudadesEntity } from '../../ubigeo/ciudades/entities/ciudades.entity';
import {
  ParroquiasEntity,
} from '../../ubigeo/parroquias/entities/parroquias.entity';
import { UsuariosEntity } from '../../usuarios/entities/usuarios.entity';
import { CComercialesGaleriaEntity } from './ccomerciales-galeria.entity';

@Entity('cco_ccomerciales')
export class CComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  correo: string;

  @Column({ name: 'tel_primero', type: 'varchar', default: '' })
  telPrimero: string;

  @Column({ name: 'tel_segundo', type: 'varchar', default: '' })
  telSegundo: string;

  @Column({ type: 'varchar', default: '' })
  direccion: string;

  @Column({ name: 'ubic_latlng', type: 'varchar', default: '' })
  ubicLatLng: string;

  @Column({ type: 'varchar', default: '' })
  desc: string;

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

  @Column({ type: 'bool', default: true })
  abierto: boolean;

  // Relaciones
  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_image' })
  image: number;

  @ManyToOne(() => GaleriaEntity)
  @JoinColumn({ name: 'id_galeria_back' })
  imageBack: number;

  @OneToMany(() => UsuariosEntity, users => users.ccomercial)
  users: UsuariosEntity[];

  @OneToMany(() => TiendasCComercialesEntity, tieCC => tieCC.ccomercial)
  tiendas: TiendasCComercialesEntity[];

  @OneToMany(() => CategoriasEntity, categoria => categoria.ccomercial)
  categorias: CategoriasEntity[];

  @ManyToOne(() => CiudadesEntity)
  @JoinColumn({ name: 'id_ciudad' })
  ciudad: number;

  @ManyToOne(() => ParroquiasEntity)
  @JoinColumn({ name: 'id_parroquia' })
  parroquia: number;

  @OneToOne(() => HorariosEntity, horarios => horarios.ccomercial, { eager: true })
  horarios: number;

  @OneToMany(() => CComercialesGaleriaEntity, ccGal => ccGal.ccomercial)
  files: CComercialesGaleriaEntity[];

  @OneToMany(() => CinesCComercialesEntity, ccC => ccC.ccomercial)
  cines: CinesCComercialesEntity[];
}
