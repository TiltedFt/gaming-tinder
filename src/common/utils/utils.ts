import { Language } from '../constants/supported-language';

export function isValueInEnum<T extends Record<string, string>>(
  value: string,
  enumObj: T,
): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

export function isSupportedLanguage(lang: string): lang is Language {
  return Object.values(Language).includes(lang as Language);
}
