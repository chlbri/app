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
import type { FnMap, FnR, MaybePromise, RecordS, ReduceArray } from '~types';

/** Internal type representation of GUARD_TYPE. */
type gType = typeof GUARD_TYPE;
/** Internal type representation of logical AND key. */
type and = gType['and'];
/** Internal type representation of logical OR key. */
type or = gType['or'];

/**
 * Union of guard descriptors and logical AND/OR guard configurations.
 */
export type GuardUnion = WithDescriber | GuardAnd | GuardOr;

/**
 * Logical AND guard structure.
 */
export type GuardAnd = {
  [k in and]: GuardUnion[];
};

/**
 * Logical OR guard structure.
 */
export type GuardOr = {
  [k in or]: GuardUnion[];
};

/**
 * JSON configuration for a guard.
 *
 * @see {@linkcode WithDescriber}, {@linkcode GuardAnd}, {@linkcode GuardOr}
 */
export type GuardConfig = GuardUnion;

/**
 * Enforces no extra keys on guard configuration objects.
 *
 * @template T - Input guard configuration type.
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
 * @template {ReadonlyArray<GuardConfig>} T - Array of guard configurations.
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
 * @template T - Guard configuration type.
 */
export type NoExtraKeysGuardConfigSoA<T> =
  T extends ReadonlyArray<GuardConfig>
    ? NoExtraKeysGuardConfigArray<T>
    : NoExtraKeysGuardConfig<T>;

/**
 * Retrieves the name of the action if it is a describer, otherwise returns the action itself.
 * @template {GuardConfig} T - GuardConfig to reduce
 * @returns The name of the action if it is a describer, otherwise the action itself.
 *
 * @see {@linkcode FromActionConfig}, {@linkcode ReduceArray}, {@linkcode GuardAnd}, {@linkcode GuardOr}
 */
export type FromGuard<T extends GuardConfig> = T extends WithDescriber
  ? FromActionConfig<T>
  : T extends GuardAnd
    ? FromGuard<ReduceArray<T['and']>>
    : T extends GuardOr
      ? FromGuard<ReduceArray<T['or']>>
      : never;

/**
 * Async predicate function or constant boolean value.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type AsyncPredicateS<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | FnMap<E, Pc, Tc, T, MaybePromise<boolean>>;

/**
 * Sync predicate function or constant boolean value.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type SyncPredicateS<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | FnMap<E, Pc, Tc, T, boolean>;

/**
 * Async predicate function or constant boolean value resolver.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type AsyncPredicateS2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | AsyncPredicateS3<E, Pc, Tc, T>;

/**
 * Sync predicate function or constant boolean value resolver.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type SyncPredicateS2<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = boolean | SyncPredicateS3<E, Pc, Tc, T>;

/**
 * Async predicate function runner.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type AsyncPredicateS3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, MaybePromise<boolean>>;

/**
 * Sync predicate function runner.
 *
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 */
export type SyncPredicateS3<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = FnR<E, Pc, Tc, T, boolean>;

/**
 * Union of all predicate functions.
 * @template {EventObject} E - the events map to use for resolving the predicate.
 * @template Pc - the type of the private context.
 * @template {PrimitiveObject} Tc - the type of the context.
 * @template {string} T - state path string type.
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
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
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
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
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
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
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
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
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
 * @template {EventObject} E - Event object type.
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
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
 * @template {EventObject} E - the events map to use for resolving the predicate.
 * @template Pc - the type of the private context.
 * @template {PrimitiveObject} Tc - the type of the context.
 * @template {string} T - state path type.
 *
 * @returns A partial record where each key is a string and each value is an type {@linkcode AsyncPredicateS}.
 *
 * @see {@linkcode RecordS}
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
export type DefinedValue<Pc = any, Tc extends PrimitiveObject = PrimitiveObject> =
  | _DefinedValue<Pc, Tc>
  | 'events'
  | 'events.type'
  | 'events.payload';
