import type { FromActionConfig, NoExtraKeysWithDescriber } from '#actions';
import type {
  AsyncPredicateS,
  Contract,
  ContractContext,
  ContractPContext,
  GuardAnd,
  GuardConfig,
  GuardOr,
  RecordS,
  SyncPredicateS2,
  WithDescriber,
} from '@bemedev/app-contract';
import type { Equals, NotUndefined } from '@bemedev/app-utils-bemedev';
import type { EmptyObject, KeysMatching } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import type { ReduceArray } from '~types';

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
} from '@bemedev/app-contract';

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
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 *
 * @returns A union type that can be a single predicate function, a combination
 * of guards with AND logic, or a combination of guards with OR logic.
 *
 * @see {@linkcode AsyncPredicateS2}, {@linkcode AsyncPredicateAnd}, {@linkcode AsyncPredicateOr}
 */
export type AsyncPredicate<Ct extends Contract = Contract> =
  | AsyncPredicateS<Ct>
  | AsyncPredicateAnd<Ct>
  | AsyncPredicateOr<Ct>;

/**
 * Async logical AND predicate wrapper.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type AsyncPredicateAnd<Ct extends Contract = Contract> = {
  and: AsyncPredicate<Ct>[];
};

/**
 * Async logical OR predicate wrapper.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type AsyncPredicateOr<Ct extends Contract = Contract> = {
  or: AsyncPredicate<Ct>[];
};

/**
 * Sync logical AND predicate wrapper.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type SyncPredicateAnd<Ct extends Contract = Contract> = {
  and: SyncPredicate<Ct>[];
};

/**
 * Sync logical OR predicate wrapper.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type SyncPredicateOr<Ct extends Contract = Contract> = {
  or: SyncPredicate<Ct>[];
};

/**
 * Sync predicate union structure.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type SyncPredicate<Ct extends Contract = Contract> =
  | SyncPredicateS2<Ct>
  | AsyncPredicateAnd<Ct>
  | AsyncPredicateOr<Ct>;

/**
 * Represents a map of guards, where each key is a string and each value is an
 * {@linkcode AsyncPredicate}.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 *
 * @see -- type {@linkcode RecordS}
 */
export type PredicateMap<Ct extends Contract = Contract> = Partial<
  RecordS<AsyncPredicateS<Ct>>
>;

/**
 * Helper type extracting keys matching non-undefined values in private or
 * public context.
 *
 * @template `Pc` - Private context type.
 * @template `Tc` - Public context type.
 */
type _DefinedValue<Pc = any, Tc = any> = KeysMatching<{
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
 * Represents a type that can be a defined value or a string representing an
 * event or its type.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type DefinedValue<Ct extends Contract = Contract> =
  | _DefinedValue<ContractPContext<Ct>, ContractContext<Ct>>
  | 'events'
  | 'events.type'
  | 'events.payload';
