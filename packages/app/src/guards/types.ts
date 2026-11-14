import type {
  FromActionConfig,
  NoExtraKeysWithDescriber,
  WithDescriber,
} from '#actions';
import type { EventObject } from '#events';
import type { Equals, NotUndefined } from '@bemedev/app-utils-bemedev';
import type { EmptyObject, KeysMatching } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import type { RecordS, ReduceArray } from '~types';
import type {
  AsyncPredicateS,
  GuardAnd,
  GuardConfig,
  GuardOr,
  SyncPredicateS2,
} from '@bemedev/app-options';

export type {
  AsyncPredicateS,
  AsyncPredicateS2,
  AsyncPredicateS3,
  GuardAnd,
  GuardConfig,
  GuardOr,
  GuardUnion,
  SyncPredicateS,
  SyncPredicateS2,
  SyncPredicateS3,
} from '@bemedev/app-options';

/**
 * Enforces no extra keys on guard configuration objects.
 *
 * @template `T` - Input guard configuration type.
 */
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

/**
 * Enforces no extra keys on tuple or array of guard configurations.
 *
 * @template | {@linkcode GuardConfig} `T` - Array of guard configurations.
 */
export type NoExtraKeysGuardConfigArray<T extends ReadonlyArray<GuardConfig>> =
  T extends [
    infer S extends GuardConfig,
    ...infer R extends ReadonlyArray<GuardConfig>,
  ]
    ? readonly [NoExtraKeysGuardConfig<S>, ...NoExtraKeysGuardConfigArray<R>]
    : [];

/**
 * Enforces no extra keys across single value or array of guard configurations.
 *
 * @template `T` - Guard configuration type.
 */
export type NoExtraKeysGuardConfigSoA<T> =
  T extends ReadonlyArray<GuardConfig>
    ? NoExtraKeysGuardConfigArray<T>
    : NoExtraKeysGuardConfig<T>;

/**
 * Retrieves the name of the action if it is a describer, otherwise returns the action itself.
 * @template | {@linkcode GuardConfig} `T` - GuardConfig to reduce
 * @returns The name of the action if it is a describer, otherwise the action itself.
 *
 * @see {@linkcode FromActionConfig}, -- type {@linkcode ReduceArray}, {@linkcode GuardAnd}, {@linkcode GuardOr}
 */
export type FromGuard<T extends GuardConfig> = T extends WithDescriber
  ? FromActionConfig<T>
  : T extends GuardAnd
    ? FromGuard<ReduceArray<T['and']>>
    : T extends GuardOr
      ? FromGuard<ReduceArray<T['or']>>
      : never;

/**
 * Union of all predicate functions.
 * @template | {@linkcode EventObject} `E` - the events map to use for resolving the predicate.
 * @template `Pc` - the type of the private context.
 * @template | {@linkcode PrimitiveObject} `Tc` - the type of the context.
 * @template `T` - state path string type.
 *
 * @returns A union type that can be a single predicate function, a combination of guards with AND logic, or a combination of guards with OR logic.
 *
 * @see {@linkcode AsyncPredicateS2}, {@linkcode AsyncPredicateAnd}, {@linkcode AsyncPredicateOr}
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

/**
 * Async logical AND predicate wrapper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 */
export type AsyncPredicateAnd<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { and: AsyncPredicate<E, Pc, Tc, T>[] };

/**
 * Async logical OR predicate wrapper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 */
export type AsyncPredicateOr<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { or: AsyncPredicate<E, Pc, Tc, T>[] };

/**
 * Sync logical AND predicate wrapper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 */
export type SyncPredicateAnd<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { and: SyncPredicate<E, Pc, Tc, T>[] };

/**
 * Sync logical OR predicate wrapper.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 */
export type SyncPredicateOr<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = { or: SyncPredicate<E, Pc, Tc, T>[] };

/**
 * Sync predicate union structure.
 *
 * @template | {@linkcode EventObject} `E` - Event object type.
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 */
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
 * Represents a map of guards, where each key is a string and each value is an type {@linkcode AsyncPredicate}.
 *
 * @template | {@linkcode EventObject} `E` - the events map to use for resolving the predicate.
 * @template `Pc` - the type of the private context.
 * @template | {@linkcode PrimitiveObject} `Tc` - the type of the context.
 * @template `T` - state path type.
 *
 * @returns A partial record where each key is a string and each value is an type {@linkcode AsyncPredicateS}.
 *
 * @see -- type {@linkcode RecordS}
 */
export type PredicateMap<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = Partial<RecordS<AsyncPredicateS<E, Pc, Tc, T>>>;

/**
 * Helper type extracting keys matching non-undefined values in private or public context.
 *
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 */
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
 * Represents a type that can be a defined value or a string representing an event or its type.
 *
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Public context type.
 */
export type DefinedValue<Pc = any, Tc extends PrimitiveObject = PrimitiveObject> =
  | _DefinedValue<Pc, Tc>
  | 'events'
  | 'events.type'
  | 'events.payload';
