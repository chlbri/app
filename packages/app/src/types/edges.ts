import type { NoExtraKeys, SoA } from '@bemedev/app-utils-bemedev';
import type { NotReadonly, SingleOrArrayL2 } from './primitives';

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

// #region type TraversableTuple

type __TraversableTuple<T, K extends ReadonlyArray<keyof T>> = K extends [
  infer Key extends keyof T,
  ...infer Rest extends ReadonlyArray<keyof T>,
]
  ? readonly [T[Key], ...__TraversableTuple<T, Rest>]
  : readonly [];

export type TraversableTuple<T, K extends SingleOrArrayL2<keyof T>> =
  K extends ReadonlyArray<keyof T>
    ? __TraversableTuple<T, K>
    : K extends keyof T
      ? NotReadonly<T[K]>
      : never;

// #endregion
