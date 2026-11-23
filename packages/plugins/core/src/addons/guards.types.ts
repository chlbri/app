import type {
  AsyncPredicateS,
  Contract,
  ContractContext,
  ContractPContext,
  EmptyObject,
  FnR,
  MaybePromise,
  PrimitiveObject,
  SyncPredicateS,
} from '@bemedev/app-contract';
import type { Equals, NotUndefined } from '@bemedev/app-utils-bemedev';
import type { KeysMatching } from '@bemedev/decompose';

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

export type ValueDefined<Ct extends Contract = Contract> = {
  sync: (path: DefinedValue<Ct>) => FnR<Ct, boolean>;
  async: (path: DefinedValue<Ct>) => FnR<Ct, MaybePromise<boolean>>;
};

export type ValueIs<Ct extends Contract = Contract> = {
  sync: (path: DefinedValue<Ct>, ...values: any[]) => FnR<Ct, boolean>;
  async: (
    path: DefinedValue<Ct>,
    ...values: any[]
  ) => FnR<Ct, MaybePromise<boolean>>;
};

export type SyncGuardUnion<C extends Contract> =
  | undefined
  | SyncPredicateS<C>
  | { and: SyncGuardUnion<C>[] }
  | { or: SyncGuardUnion<C>[] };

export type AsyncGuardUnion<C extends Contract> =
  | undefined
  | AsyncPredicateS<C>
  | { and: AsyncGuardUnion<C>[] }
  | { or: AsyncGuardUnion<C>[] };
