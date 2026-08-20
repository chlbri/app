import type { NoExtraKeys, SoA } from '@bemedev/app-utils-bemedev';
import type { NotReadonly, SingleOrArrayL2 } from './primitives';

/**
 * Refines a readonly array of string literals `T` into a union of its elements or `string` if empty.
 *
 * @template T - The string array type extending `ReadonlyArray<string>`.
 */
export type RefineStringArray<T extends ReadonlyArray<string>> = T extends []
  ? string
  : T[number];

/**
 * Recursively enforces that elements of array `T` contain no extra keys relative to type `Parent`.
 *
 * @template T - Array type extending `ReadonlyArray<any>`.
 * @template `Parent` - Expected parent structure.
 */
export type NoExtraKeysArray<T extends ReadonlyArray<any>, Parent> = T extends [
  infer Head extends Parent,
  ...infer Rest extends ReadonlyArray<any>,
]
  ? [NoExtraKeys<Head, Parent>, ...NoExtraKeysArray<Rest, Parent>]
  : [];

/**
 * Enforces no extra keys on a Single-or-Array (SoA) structure `T` relative to `Parent`.
 *
 * @template T - Target structure extending `SoA<any>`.
 * @template `Parent` - Expected parent structure.
 */
export type NoExtraKeySoa<T extends SoA<any>, Parent> =
  T extends ReadonlyArray<any>
    ? NoExtraKeysArray<T, Parent>
    : T extends any[]
      ? NoExtraKeys<T, Parent>[]
      : NoExtraKeys<T, Parent>;

// #region type TraversableTuple

/**
 * Internal recursive helper for constructing a tuple type by traversing object property keys.
 *
 * @template `T` - Source object type.
 * @template `K` - Tuple array of keys.
 */
type __TraversableTuple<T, K extends ReadonlyArray<keyof T>> = K extends [
  infer Key extends keyof T,
  ...infer Rest extends ReadonlyArray<keyof T>,
]
  ? readonly [T[Key], ...__TraversableTuple<T, Rest>]
  : readonly [];

/**
 * Maps object keys `K` of type `T` into a traversable tuple or property value.
 *
 * @template `T` - Source object type.
 * @template K - Keys extending type {@linkcode SingleOrArrayL2} of `keyof T`.
 */
export type TraversableTuple<T, K extends SingleOrArrayL2<keyof T>> =
  K extends ReadonlyArray<keyof T>
    ? __TraversableTuple<T, K>
    : K extends keyof T
      ? NotReadonly<T[K]>
      : never;

// #endregion
