import { HorariosEntity } from '../../horarios/entities/horarios.entity';
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

import * as CONST from '../../../common/constants';
import { CategoriasEntity } from '../../categorias/entities/categorias.entity';
import { CiudadesEntity } from '../../ciudades/entities/ciudades.entity';
import { ContactosEntity } from '../../contactos/entities/contactos.entity';
import { PaisesEntity } from '../../paises/entities/paises.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity(CONST.MODULES.CCOMERCIALES)
export class CComercialesEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', default: '' })
  correo: string;

  @Column({ name: 'tel_primero', type: 'varchar', default: '' })
  telPrimero: string;

  @Column({ name: 'tel_segundo', type: 'varchar', default: '' })
  telSegundo: string;

  @Column({ type: 'varchar', default: '' })
  direccion: string;

  @Column({ name: 'ubic_latlng', type: 'varchar', default: '' })
  ubicLatLng: string;

  @Column({ name: 'total_tiendas', type: 'integer', default: 0 })
  totalTiendas: number;

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

  @Column({ name: 'image_url', type: 'varchar', default: '' })
  imageUrl: string;

  @Column("text", { array: true, default: [] })
  galeria: string[];

  // Relaciones
  @OneToMany(() => UsersEntity, users => users.ccomercial)
  users: UsersEntity[];

  @OneToMany(() => TiendasEntity, tiendas => tiendas.ccomercial)
  tiendas: TiendasEntity[];

  @OneToMany(() => CategoriasEntity, categoria => categoria.ccomercial)
  categorias: CategoriasEntity[];

  @OneToMany(() => ContactosEntity, categoria => categoria.ccomercial)
  contactos: ContactosEntity[];

  @ManyToOne(() => PaisesEntity, paises => paises.ccomerciales)
  @JoinColumn({ name: 'paises_id' })
  pais: number;

  @ManyToOne(() => CiudadesEntity, ciudades => ciudades.ccomerciales)
  @JoinColumn({ name: 'ciudades_id' })
  ciudad: number;

  @OneToOne(() => HorariosEntity, horarios => horarios.ccomercial, { eager: true })
  horarios: number;

}
