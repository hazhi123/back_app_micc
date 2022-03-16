export const isEmptyUndefined = (data) => {
    return data === null || data === undefined || data === 0 || data === '' || data === 'null' || data === {} || data === 'undefined';
}

export const replaceEmpty = ({ data, upper = false, empty = false }) => {
    if (upper && !empty) {
        return data.split(' ').join('-').toUpperCase()
    } else {
        if (empty) {
            return data.split(' ').join('')
        } else {
            return data.split(' ').join('-')
        }
    }
}