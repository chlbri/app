import type {
  AsyncPredicateS,
  Contract,
  ContractContext,
  ContractPContext,
  FnR,
  MaybePromise,
  SyncPredicateS,
} from '@bemedev/app-contract';
import type { Equals, NotUndefined } from '@bemedev/app-utils-bemedev';
import type { KeysMatching } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Key-less object used when a context is absent.
 *
 * `Record<never, never>` is required here: `Record<string, never>` still
 * satisfies `TrueObject`, which makes `KeysMatching` recurse on itself.
 */
type NoKeys = Record<never, never>;

/**
 * Helper type extracting keys matching non-undefined values in private or
 * public context.
 *
 * @template `Pc` - Private context type.
 * @template `Tc` - Public context type.
 */
type _DefinedValue<Pc = any, Tc = any> = KeysMatching<{
  pContext: Equals<any, Pc> extends true
    ? NoKeys
    : NotUndefined<Pc> extends never
      ? NoKeys
      : NotUndefined<Pc>;

  context: Equals<PrimitiveObject, Tc> extends true
    ? NoKeys
    : NotUndefined<Tc> extends never
      ? NoKeys
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

/**
 * Guard checking that a path of the machine is defined.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 *
 * @see -- type {@linkcode DefinedValue}, -- type {@linkcode FnR}
 */
export type ValueDefined<Ct extends Contract = Contract> = {
  sync: (path: DefinedValue<Ct>) => FnR<Ct, boolean>;
  async: (path: DefinedValue<Ct>) => FnR<Ct, MaybePromise<boolean>>;
};

/**
 * Guard checking that a path of the machine matches one of the supplied values.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 *
 * @see -- type {@linkcode DefinedValue}, -- type {@linkcode FnR}
 */
export type ValueIs<Ct extends Contract = Contract> = {
  sync: (path: DefinedValue<Ct>, ...values: any[]) => FnR<Ct, boolean>;
  async: (
    path: DefinedValue<Ct>,
    ...values: any[]
  ) => FnR<Ct, MaybePromise<boolean>>;
};

/**
 * A synchronous guard accepted by {@linkcode Addons.guardBatch}.
 *
 * Guards combine through `and` and `or` objects and may be omitted.
 *
 * @template | {@linkcode Contract} `C` - Contract of the machine.
 *
 * @see -- type {@linkcode SyncPredicateS}
 */
export type SyncGuardUnion<C extends Contract> =
  | undefined
  | SyncPredicateS<C>
  | { and: SyncGuardUnion<C>[] }
  | { or: SyncGuardUnion<C>[] };

/**
 * An asynchronous guard accepted by {@linkcode Addons.guardBatch}.
 *
 * Guards combine through `and` and `or` objects and may be omitted.
 *
 * @template | {@linkcode Contract} `C` - Contract of the machine.
 *
 * @see -- type {@linkcode AsyncPredicateS}
 */
export type AsyncGuardUnion<C extends Contract> =
  | undefined
  | AsyncPredicateS<C>
  | { and: AsyncGuardUnion<C>[] }
  | { or: AsyncGuardUnion<C>[] };
