import type {
  FromActionConfig,
  NoExtraKeysWithDescriber,
  WithDescriber,
} from '#actions';
import type { GUARD_TYPE } from '#constants';
import type { EventObject } from '#events';
import type { Equals, NotUndefined } from '@bemedev/app-utils-bemedev';
import type { EmptyObject, KeysMatching } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import type {
  FnMap,
  FnR,
  MaybePromise,
  RecordS,
  ReduceArray,
} from '~types';

type gType = typeof GUARD_TYPE;
type and = gType['and'];
type or = gType['or'];

export type GuardUnion = WithDescriber | GuardAnd | GuardOr;

export type GuardAnd = {
  [k in and]: GuardUnion[];
};

export type GuardOr = {
  [k in or]: GuardUnion[];
};

/**
 * JSON configuration for a guard.
 *
 * @see {@linkcode WithDescriber} for more details.
 * @see {@linkcode GuardAnd} for more details.
 * @see {@linkcode GuardOr} for more details.
 */
export type GuardConfig = GuardUnion;

export type NoExtraKeysGuardConfig<T> = T extends WithDescriber
  ? NoExtraKeysWithDescriber<T>
  : T extends GuardAnd
    ? { readonly and: NoExtraKeysGuardConfigArray<T['and']> } & Record<
        Exclude<keyof T, 'and'>,
        never
      >
    : T extends GuardOr
      ? { readonly or: NoExtraKeysGuardConfigArray<T['or']> } & Record<
          Exclude<keyof T, 'or'>,
          never
        >
      : never;

export type NoExtraKeysGuardConfigArray<
  T extends ReadonlyArray<GuardConfig>,
> = T extends [
  infer S extends GuardConfig,
  ...infer R extends ReadonlyArray<GuardConfig>,
]
  ? readonly [NoExtraKeysGuardConfig<S>, ...NoExtraKeysGuardConfigArray<R>]
  : [];

export type NoExtraKeysGuardConfigSoA<T> =
  T extends ReadonlyArray<GuardConfig>
    ? NoExtraKeysGuardConfigArray<T>
    : NoExtraKeysGuardConfig<T>;

/**
 * Retrieves the name of the action if it is a describer, otherwise returns the action itself.
 * @template : type {@linkcode GuardConfig} [T], GuardConfig to reduce
 * @return The name of the action if it is a describer, otherwise the action itself.
 *
 * @see {@linkcode FromActionConfig} for more details.
 * @see {@linkcode ReduceArray} for more details.
 * @see {@linkcode GuardAnd} for more details.
 * @see {@linkcode GuardOr} for more details.
 */
export type FromGuard<T extends GuardConfig> = T extends WithDescriber
  ? FromActionConfig<T>
  : T extends GuardAnd
    ? FromGuard<ReduceArray<T['and']>>
    : T extends GuardOr
      ? FromGuard<ReduceArray<T['or']>>
      : never;

export type AsyncPredicateS<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | FnMap<E, Pc, Tc, T, MaybePromise<boolean>>;

export type SyncPredicateS<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | FnMap<E, Pc, Tc, T, boolean>;

export type AsyncPredicateS2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | AsyncPredicateS3<E, Pc, Tc, T>;

export type SyncPredicateS2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | SyncPredicateS3<E, Pc, Tc, T>;

export type AsyncPredicateS3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, MaybePromise<boolean>>;

export type SyncPredicateS3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, boolean>;

/**
 * Union of all predicate functions.
 * @template : type {@linkcode EventObject} [E], the events map to use for resolving the predicate.
 * @template : [Pc], the type of the private context.
 * @template : type {@linkcode PrimitiveObject} [Tc], the type of the context.
 *
 * @returns A union type that can be a single predicate function, a combination of guards with AND logic, or a combination of guards with OR logic.
 *
 * @see {@linkcode AsyncPredicateS2} for single predicate function.
 * @see {@linkcode AsyncPredicateAnd} for combining multiple guards with AND logic.
 * @see {@linkcode AsyncPredicateOr} for combining multiple guards with OR logic.
 */
export type AsyncPredicate<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> =
  | AsyncPredicateS<E, Pc, Tc, T>
  | AsyncPredicateAnd<E, Pc, Tc, T>
  | AsyncPredicateOr<E, Pc, Tc, T>;

export type AsyncPredicateAnd<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  and: AsyncPredicate<E, Pc, Tc, T>[];
};

export type AsyncPredicateOr<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  or: AsyncPredicate<E, Pc, Tc, T>[];
};

export type SyncPredicateAnd<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  and: SyncPredicate<E, Pc, Tc, T>[];
};

export type SyncPredicateOr<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  or: SyncPredicate<E, Pc, Tc, T>[];
};

export type SyncPredicate<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> =
  | SyncPredicateS2<E, Pc, Tc, T>
  | AsyncPredicateAnd<E, Pc, Tc, T>
  | AsyncPredicateOr<E, Pc, Tc, T>;

/**
 * Represents a map of guards, where each key is a string and each value is a {@linkcode AsyncPredicate}.
 *
 * @template : type {@linkcode EventsMap} [E], the events map to use for resolving the predicate.
 * @template : type {@linkcode PromiseeMap} [P], the promisees map to use for resolving the predicate.
 * @template : [Pc], the type of the private context.
 * @template : type {@linkcode PrimitiveObject} [Tc], the type of the context.
 *
 * @returns A partial record where each key is a string and each value is a {@linkcode AsyncPredicateS}.
 *
 * @see {@linkcode RecordS} for single predicate function.
 */
export type PredicateMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<RecordS<AsyncPredicateS<E, Pc, Tc, T>>>;

type _DefinedValue<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = KeysMatching<{
  pContext: Equals<any, Pc> extends true
    ? EmptyObject
    : NotUndefined<Pc> extends never
      ? EmptyObject
      : NotUndefined<Pc>;

  context: Equals<PrimitiveObject, Tc> extends true
    ? EmptyObject
    : NotUndefined<Tc> extends never
      ? EmptyObject
      : NotUndefined<Tc>;
}>;

/**
 * Represents a type that can be a defined value or a string representing an event or its type
 *
 * @template : [Pc] The type of the private context.
 * @template : type {@linkcode PrimitiveObject} [Tc] The type of the context.
 */
export type DefinedValue<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = _DefinedValue<Pc, Tc> | 'events' | 'events.type' | 'events.payload';
