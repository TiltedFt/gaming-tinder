export function isValueInEnum<T extends Record<string, string>>(
  value: string,
  enumObj: T,
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}
