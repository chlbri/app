import type { NotUndefined } from '@bemedev/app-utils-bemedev';

export const notUndefined = <T>(value: T) => value as NotUndefined<T>;

export const notU = notUndefined;
