import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
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
import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import {
  ComentariosEntity,
} from '../../comentarios/entities/comentarios.entity';
import { ContactosEntity } from '../../contactos/entities/contactos.entity';
import { GaleriaEntity } from '../../galeria/entities/galeria.entity';
import { GuardadosEntity } from '../../guardados/entities/guardados.entity';
import { LicenciasEntity } from '../../licencias/entities/licencias.entity';
import { LikesEntity } from '../../likes/entities/likes.entity';
import { MensajesEntity } from '../../mensajes/entities/mensajes.entity';
import { PerfilesEntity } from '../../perfiles/entities/perfiles.entity';
import {
  PublicacionesEntity,
} from '../../publicaciones/entities/publicaciones.entity';
import { TiendasEntity } from '../../tiendas/entities/tiendas.entity';
import { CiudadesEntity } from '../../ubigeo/ciudades/entities/ciudades.entity';
import {
  UsersCComercialesEntity,
} from '../../users-ccomerciales/entities/users-ccomerciales.entity';
import { UsersInformacionEntity } from './users-informacion.entity';

@Entity(CONST.MODULES.USERS.USERS)
export class UsersEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  apellido: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  user: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

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

  @Column({ name: 'is_trabaja_tienda', type: 'bool', default: false })
  isTrabajaTienda: boolean;

  @Column({ name: 'is_visitante', type: 'bool', default: true })
  isVisitante: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return
    this.password = await bcrypt.hash(this.password, 10)
  }

  // Relaciones 
  @ManyToOne(() => PerfilesEntity)
  @JoinColumn({ name: 'id_perfil' })
  perfil: number;

  @ManyToOne(() => TiendasEntity)
  @JoinColumn({ name: 'id_tienda' })
  tienda: number;

  @ManyToOne(() => CComercialesEntity)
  @JoinColumn({ name: 'id_ccomercial' })
  ccomercial: number;

  @ManyToOne(() => CiudadesEntity)
  @JoinColumn({ name: 'id_ciudad' })
  ciudad: number;

  @OneToOne(() => UsersInformacionEntity, informacion => informacion.user, { eager: true })
  informacion: UsersInformacionEntity;

  @OneToOne(() => LicenciasEntity, licencias => licencias.user, { eager: true })
  licencia: LicenciasEntity;

  @OneToMany(() => PublicacionesEntity, pub => pub.userEditor)
  publicaciones: PublicacionesEntity[];

  @OneToMany(() => ComentariosEntity, comentarios => comentarios.user)
  comentarios: ComentariosEntity[];

  @OneToMany(() => GuardadosEntity, guardado => guardado.user)
  guardados: GuardadosEntity[];

  @OneToMany(() => LikesEntity, likes => likes.user)
  likes: LikesEntity[];

  @OneToMany(() => UsersCComercialesEntity, likes => likes.user)
  ccomerciales: UsersCComercialesEntity[];

  @OneToMany(() => ContactosEntity, contactos => contactos.user)
  contactos: ContactosEntity[];

  @OneToMany(() => MensajesEntity, mensajes => mensajes.user)
  mensajes: MensajesEntity[];

  @OneToOne(() => GaleriaEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_galeria_image' })
  image: number;

  @OneToOne(() => GaleriaEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_galeria_back' })
  imageBack: number;

}

