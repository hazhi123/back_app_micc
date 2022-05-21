import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsuariosEntity } from '../usuarios/entities/usuarios.entity';

@Injectable()
export class DashboardService {

  constructor(

    @InjectRepository(UsuariosEntity)
    private readonly usuariosRP: Repository<UsuariosEntity>,

  ) { }

  async getAdmin() {

    const adminCount = await this.usuariosRP.count({ perfil: 1 });
    const ccomercialCount = await this.usuariosRP.count({ perfil: 2 });
    const tiendaCount = await this.usuariosRP.count({ perfil: 3 });
    const cineCount = await this.usuariosRP.count({ perfil: 4 });
    const visitantesCount = await this.usuariosRP.count({ perfil: 5 });
    const totalCount = await this.usuariosRP.count();

    const data = {
      'usuarios': {
        "total": totalCount,
        "administradores": adminCount,
        "ccomerciales": ccomercialCount,
        "tiendas": tiendaCount,
        "cines": cineCount,
        "visitantes": visitantesCount,
      }
    }

    return data;
  }

  //   const findOne = await this.contactosRP.findOne({
  //     where: {
  //       user: dto.user,
  //       tiendaCC: one.id,
  //     }
  //   })

  //   if (!isEmptyUndefined(findOne)) throw new HttpException({
  //     statusCode: HttpStatus.ACCEPTED,
  //     message: 'Esta tienda ya se encuentra en la lista de contactos',
  //   }, HttpStatus.ACCEPTED)

  //   const save = await this.contactosRP.save({
  //     user: dto.user,
  //     tiendaCC: one.id,
  //     createdBy: userLogin.id,
  //     createdAt: new Date(),
  //     updatedBy: userLogin.id,
  //     updatedAt: new Date(),
  //   });

  //   const getOne = await this.getOne(save.id)
  //   return getOne;
  // }

  // async getOne(id: number): Promise<DashboardEntity> {
  //   const getOne = await this.contactosRP
  //     .createQueryBuilder("con")
  //     .leftJoinAndSelect("con.tienda", "ti")
  //     .leftJoinAndSelect("ti.image", "imgGal")
  //     .leftJoinAndSelect("ti.imageBack", "imgBackGal")
  //     .select([
  //       'ti.id',
  //       'ti.nombre',
  //       'ti.desc',
  //       'ti.status',
  //       'ti.isGastro',
  //       'imgGal.id',
  //       'imgGal.file',
  //       'imgBackGal.id',
  //       'imgBackGal.file',
  //     ])
  //     .where('con.id = :id', { id })
  //     .getOne()
  //   if (isEmptyUndefined(getOne)) return null
  //   return getOne;
  // }

  // async getAll(dto, options: IPaginationOptions): Promise<Pagination<DashboardEntity>> {
  //   const query = await this.contactosRP.createQueryBuilder('con')
  //     .leftJoinAndSelect("con.tiendaCC", "tieCC")
  //     .leftJoinAndSelect("tieCC.tienda", "tie")
  //     .leftJoinAndSelect("tie.image", "tiImgGal")
  //     .leftJoinAndSelect("tie.imageBack", "tiImgBackGal")
  //     .leftJoinAndSelect("con.user", "user")
  //     .leftJoinAndSelect("user.image", "usimgGal")
  //     .leftJoinAndSelect("user.image", "usimgBackGal")
  //     .select([
  //       'con.id',
  //       'con.ultimoMensaje',
  //       'con.status',
  //       'tieCC.id',
  //       'tieCC.ubicacion',
  //       'tieCC.correo',
  //       'tieCC.telPrimero',
  //       'tie.id',
  //       'tie.nombre',
  //       'user.id',
  //       'user.nombre',
  //       'user.apellido',
  //       'usimgGal.id',
  //       'usimgGal.file',
  //       'usimgBackGal.id',
  //       'usimgBackGal.file',
  //       'tiImgGal.id',
  //       'tiImgGal.file',
  //       'tiImgBackGal.id',
  //       'tiImgBackGal.file',
  //     ])
  //   if (!isEmptyUndefined(dto.tienda)) {
  //     query.andWhere('tie.id = :tienda', { tienda: dto.tienda })
  //   }
  //   if (!isEmptyUndefined(dto.user)) {
  //     query.andWhere('con.user = :user', { user: dto.user })
  //   }
  //   if (!isEmptyUndefined(dto.status)) {
  //     query.andWhere('con.status = :status', { status: dto.status })
  //   }
  //   query.orderBy('con.id', 'DESC')
  //   query.getMany();
  //   return paginate<DashboardEntity>(query, options);
  // }

  // async delete(id: number) {
  //   const getOne = await this.getOne(id);
  //   if (isEmptyUndefined(getOne)) throw new HttpException({
  //     statusCode: HttpStatus.ACCEPTED,
  //     message: CONST.MESSAGES.COMMON.ERROR.DELETE,
  //   }, HttpStatus.ACCEPTED)
  //   await this.contactosRP.delete(id);
  //   return getOne;
  // }

}
