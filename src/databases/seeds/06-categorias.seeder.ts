import { CategoriasEntity } from '../../modules/categorias/entities/categorias.entity';
import { Connection } from 'typeorm';
import {
  Factory,
  Seeder,
} from 'typeorm-seeding';

export default class CategoriasSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(CategoriasEntity)
      .values([
        { nombre: "Gastronómica", desc: 'Gastronómica', createdBy: 1, updatedBy: 1, imageUrl: 'https://larepublica.pe/resizer/i2wTaYs1U50_UWX1zwXVztjh74o=/1250x735/top/smart/cloudfront-us-east-1.images.arcpublishing.com/gruporepublica/5ZWFRGHVL5E7NECDTO3EDGP2DI.jpg' },
        { nombre: "Bancos", desc: 'Bancos', createdBy: 1, updatedBy: 1, imageUrl: 'https://cloudfront-us-east-1.images.arcpublishing.com/semana/3VB4N7AYOBGW7LAMLNNJG3IBUQ.jpg' },
        { nombre: "Barberías", desc: 'Barberías', createdBy: 1, updatedBy: 1, imageUrl: 'https://previews.123rf.com/images/olgasiv/olgasiv1407/olgasiv140700009/30666403-iconos-blancos-sobre-fondo-negro-tema-peluquer%C3%ADa.jpg' },
        { nombre: "Belleza", desc: 'Belleza', createdBy: 1, updatedBy: 1, imageUrl: 'https://st4.depositphotos.com/3311429/i/600/depositphotos_247488768-stock-photo-cosmetics-makeup-composition-pink-background.jpg' },
        { nombre: "Bodegón", desc: 'Bodegón', createdBy: 1, updatedBy: 1, imageUrl: 'https://blogs.gestion.pe/el-vino-de-la-semana/wp-content/uploads/sites/111/2019/12/pozito.jpg' },
        { nombre: "Diversión", desc: 'Diversión', createdBy: 1, updatedBy: 1, imageUrl: 'https://gestion.pe/resizer/Omlrosdgo1DnVSD1bcQWzGolKXc=/980x528/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/YNMEBXELRBCB5GOKE4ZQEHG3VI.jpg' },
        { nombre: "Estética", desc: 'Estética', createdBy: 1, updatedBy: 1, imageUrl: 'https://www.flowww.net/hubfs/Q1_Febrero%202020/BLOG/cual-es-la-mejor-ubicacion-para-abrir-un-centro-de-estetica_flowww.jpg' },
        { nombre: "Infantil", desc: 'Infantil', createdBy: 1, updatedBy: 1, imageUrl: 'https://previews.123rf.com/images/dotshock/dotshock1502/dotshock150200927/40841289-moderno-centro-commerciale-parco-giochi-per-bambini-e-videogiochi.jpg' },
        { nombre: "Joyería", desc: 'Joyería', createdBy: 1, updatedBy: 1, imageUrl: 'https://www.elmira.es/asset/thumbnail,992,558,center,center//media/elmira/images/2021/06/15/2021061522292462766.jpg' },
        { nombre: "Juguetería", desc: 'Juguetería', createdBy: 1, updatedBy: 1, imageUrl: 'https://mimamaesnovata.com/wp-content/uploads/2019/06/IMG_3104.jpg' },
        { nombre: "Moda", desc: 'Moda', createdBy: 1, updatedBy: 1, imageUrl: 'https://milanofashiontour.com/wp-content/uploads/2017/10/private-sale-and-personal-shopping-tour.jpg' },
        { nombre: "Repostería", desc: 'Repostería', createdBy: 1, updatedBy: 1, imageUrl: 'https://stendhal.edu.pe/wp-content/uploads/2021/03/pasteleria-comercial-FILEminimizer.png' },
        { nombre: "Salud", desc: 'Salud', createdBy: 1, updatedBy: 1, imageUrl: 'https://ak.picdn.net/shutterstock/videos/1065814348/thumb/2.jpg?ip=x480' },
        { nombre: "Servicios", desc: 'Servicios', createdBy: 1, updatedBy: 1, imageUrl: 'https://dimobaservicios.com/wp-content/uploads/2021/10/cc.png' },
        { nombre: "Tecnología", desc: 'Tecnología', createdBy: 1, updatedBy: 1, imageUrl: 'https://espacio.fundaciontelefonica.com/wp-content/uploads/2019/01/taito2_1100x550-1100x550.jpg' },
        { nombre: "Accesorios", desc: 'Accesorios', createdBy: 1, updatedBy: 1, imageUrl: 'https://almalatina.yanbal.com/wp-content/uploads/2018/09/Accesorios-con-amuletos-col1.jpg' },
      ])
      .execute()
  }
}