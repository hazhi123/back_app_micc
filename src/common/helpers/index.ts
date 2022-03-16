export const EnumToString = (_enum: object) =>
  Object.keys(_enum)
    .map(key => _enum[key])
    .filter(value => typeof value === 'string') as string[];

export const isEmptyUndefined = (data) => {
  return data === null || data === undefined || data === 0 || data === '' || data === 'null' || data === {} || data === 'undefined';
}