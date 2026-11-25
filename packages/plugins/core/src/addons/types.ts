import type { RecordS } from '@bemedev/app-contract';
import type { Fn, NotReadonly } from '@bemedev/app-utils-bemedev';
import type { Decompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Generic function type signature.
 *
 * Re-exported from `@bemedev/app-utils-bemedev`, the lowest layer of the
 * dependency graph, so the plugin and machine runtimes share one definition.
 */
export type { Fn };

/**
 * A type that represents a record with string keys and values of type {@linkcode R}.
 *
 * @template `S` - The string keys of the record.
 * @template `R` - The type of the values in the record, optional
 *
 * @remarks Simplified version of {@linkcode Record}
 */
export type KeyU<S extends string, R = unknown> = Record<S, R>;

/**
 * Synchronous and asynchronous variants of a single utility.
 *
 * @template `S` - Synchronous implementation type.
 * @template `A` - Asynchronous implementation type.
 */
export type UtilityPair<S = Fn, A = Fn> = { sync: S; async: A };

/**
 * Second version of simple machine options.
 *
 * @see -- type {@linkcode Partial}, -- type {@linkcode Record}
 */
export type SimpleMachineOptions2 = Partial<
  Record<'actions' | 'guards' | 'delays', any> &
    Record<'actors', { children?: RecordS<any>; emitters?: RecordS<any> }>
>;

/**
 * Decomposed context paths of type `Tc`, excluding array index segments.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type to decompose.
 * @template `_Pc` - Unused private context placeholder, kept for signature parity.
 */
export type DecomposeC<
  Tc extends PrimitiveObject = PrimitiveObject,
  _Pc = any,
> = Omit<
  Decompose<NonNullable<Tc>, { object: 'both'; start: false; sep: '.' }>,
  `${string}.[${number}]${string}`
>;

/**
 * Single element or readonly array type of `T`.
 *
 * @template `T` - The element type.
 */
export type SingleOrArrayR<T> = T | readonly T[];

/**
 * Single element or array type with at least two elements of type `T`.
 *
 * @template `T` - The element type.
 */
export type SingleOrArrayL2<T> = T | [T, T, ...T[]];

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
 * @template `K` - Keys extending type {@linkcode SingleOrArrayL2} of `keyof T`.
 */
export type TraversableTuple<T, K extends SingleOrArrayL2<keyof T>> =
  K extends ReadonlyArray<keyof T>
    ? __TraversableTuple<T, K>
    : K extends keyof T
      ? NotReadonly<T[K]>
      : never;

/**
 * Synchronous traversable tuple type alias for type {@linkcode TraversableTuple}.
 *
 * @template `T` - Source object type.
 * @template `K` - Keys extending type {@linkcode SingleOrArrayL2} of `keyof T`.
 */
export type TraversableTupleSync<
  T,
  K extends SingleOrArrayL2<keyof T>,
> = TraversableTuple<T, K>;

/**
 * Union type of traversable tuple `R` or Promise resolving to `R`.
 *
 * @template `T` - Source object type.
 * @template | {@linkcode SingleOrArrayL2} `K` - Keys extending `keyof T`.
 * @template | {@linkcode TraversableTuple} `R` - Resolved traversable tuple type.
 */
export type TraversableTupleAsync<
  T,
  K extends SingleOrArrayL2<keyof T>,
  R extends TraversableTuple<T, K> = TraversableTuple<T, K>,
> = R | Promise<R>;
