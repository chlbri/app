import { partialCall } from '#bemedev/features/functions/functions/partialCall';
import type { SoA } from '@bemedev/typings';

export const isSoa = <T = any>(
  check: (value: unknown) => value is T,
  entry: unknown,
): entry is SoA<T> => {
  if (Array.isArray(entry)) return entry.every(check);
  else return check(entry);
};

export const checkSoAString = partialCall(
  isSoa,
  str => typeof str === 'string',
) as {
  (value: unknown): value is SoA<string>;

  orUndefined: (value: unknown) => value is SoA<string> | undefined;
};

checkSoAString.orUndefined = (
  value: unknown,
): value is SoA<string> | undefined => {
  if (value === undefined) return true;
  return checkSoAString(value);
};
