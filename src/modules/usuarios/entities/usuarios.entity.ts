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

import {
  CComercialesEntity,
} from '../../ccomerciales/entities/ccomerciales.entity';
import { CinesEntity } from '../../cines/cines/entities/cines.entity';
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
import { UsuariosCComercialesEntity } from './usuarios-ccomerciales.entity';
import { UsuariosInformacionEntity } from './usuarios-informacion.entity';

@Entity('usu_usuarios')
export class UsuariosEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  apellido: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  usuario: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  contrasena: string;

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

  @Column({ name: 'is_trabajor', type: 'bool', default: false })
  isTrabajador: boolean;

  @Column({ name: 'is_visitante', type: 'bool', default: true })
  isVisitante: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.contrasena) return
    this.contrasena = await bcrypt.hash(this.contrasena, 10)
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

  @ManyToOne(() => CinesEntity)
  @JoinColumn({ name: 'id_cine' })
  cine: number;

  @ManyToOne(() => CiudadesEntity)
  @JoinColumn({ name: 'id_ciudad' })
  ciudad: number;

  @OneToOne(() => UsuariosInformacionEntity, informacion => informacion.usuario, { eager: true })
  informacion: UsuariosInformacionEntity;

  @OneToOne(() => LicenciasEntity, licencias => licencias.usuario, { eager: true })
  licencia: LicenciasEntity;

  @OneToMany(() => PublicacionesEntity, pub => pub.usuarioEditor)
  publicaciones: PublicacionesEntity[];

  @OneToMany(() => ComentariosEntity, comentarios => comentarios.usuario)
  comentarios: ComentariosEntity[];

  @OneToMany(() => GuardadosEntity, guardado => guardado.usuario)
  guardados: GuardadosEntity[];

  @OneToMany(() => LikesEntity, likes => likes.usuario)
  likes: LikesEntity[];

  @OneToMany(() => UsuariosCComercialesEntity, likes => likes.usuario)
  ccomerciales: UsuariosCComercialesEntity[];

  @OneToMany(() => ContactosEntity, contactos => contactos.usuario)
  contactos: ContactosEntity[];

  @OneToMany(() => MensajesEntity, mensajes => mensajes.usuario)
  mensajes: MensajesEntity[];

  @ManyToOne(() => GaleriaEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_galeria_image' })
  image: number;

  @ManyToOne(() => GaleriaEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'id_galeria_back' })
  imageBack: number;

}

