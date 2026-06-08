import type { NoExtraKeys, SoA } from '@bemedev/app-utils-bemedev';

export type RefineStringArray<T extends ReadonlyArray<string>> =
  T extends [] ? string : T[number];

export type NoExtraKeysArray<
  T extends ReadonlyArray<any>,
  Parent,
> = T extends [
  infer Head extends Parent,
  ...infer Rest extends ReadonlyArray<any>,
]
  ? [NoExtraKeys<Head, Parent>, ...NoExtraKeysArray<Rest, Parent>]
  : [];

export type NoExtraKeySoa<T extends SoA<any>, Parent> =
  T extends ReadonlyArray<any>
    ? NoExtraKeysArray<T, Parent>
    : T extends any[]
      ? NoExtraKeys<T, Parent>[]
      : NoExtraKeys<T, Parent>;
