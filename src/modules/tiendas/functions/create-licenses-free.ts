import { LicenciasEntity } from '../../licencias/entities/licencias.entity';

function generarCodigo(largo) {
    var mapa = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        codigo = '',
        i = 0;

    for (i; i < largo; i++) {
        codigo += mapa.charAt(Math.floor(Math.random() * mapa.length));
    }
    return codigo;
}

export const createLicensesFree = async (licensesRP, usersRP, data) => {

    let value = ''
    // inicializo el array con la cuenta de los valores a cero
    for (let index = 0; index < 4; index++) {
        if (index == 3) {
            value = value + generarCodigo(4)
        } else {
            value = value + generarCodigo(4) + '-'
        }
    }

    await licensesRP.createQueryBuilder()
        .insert()
        .into(LicenciasEntity)
        .values([
            {
                licencia: value,
                fechaInicio: '15-12-2021',
                fechaFinal: '15-01-2022',
                createdBy: data.userLoginId,
                updatedBy: data.userLoginId,
                user: data.userId,
                isGratis: true,
                status: true,
            },
        ])
        .execute()

    // const licenses = await repository.createQueryBuilder()
    //     .where('license = :value', { value })
    //     .getOne()

}




