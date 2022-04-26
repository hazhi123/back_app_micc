export const generarCodigo = (largo) => {
    var mapa = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        codigo = '',
        i = 0;

    for (i; i < largo; i++) {
        codigo += mapa.charAt(Math.floor(Math.random() * mapa.length));
    }
    return codigo;
}

export const codigoLincencia = () => {
    let value = ''
    // inicializo el array con la cuenta de los valores a cero
    for (let index = 0; index < 4; index++) {
        if (index == 3) {
            value = value + generarCodigo(4)
        } else {
            value = value + generarCodigo(4) + '-'
        }
    }
    return value;
}
