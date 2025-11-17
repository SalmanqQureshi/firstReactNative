export interface MarginPaddingType {
  All?: number | `${number}%`;
  Top?: number | `${number}%`;
  Bottom?: number | `${number}%`;
  Left?: number | `${number}%`;
  Right?: number | `${number}%`;
  Horizontal?: number | `${number}%`;
  Vertical?: number | `${number}%`;
}

export const getMarginPadding = (
  value: MarginPaddingType,
  type: 'margin' | 'padding',
) => {
  const object = {};
  if (!!value.All) {
    //@ts-ignore
    object[type] = Number.isInteger(value.All)
      ? Number(value.All)
      : value.All;
  }
  Object.entries(value).filter(s => s[0] != "All").forEach(([key, value]) => {
    //@ts-ignore
    object[`${type}${key}`] = Number.isInteger(value)
      ? Number(value)
      : value;
  });
  return object;
};
