import type {
  AsyncPredicateS,
  Contract,
  FnR,
  MaybePromise,
  SyncPredicateS,
} from '@bemedev/app-contract';

export type ValueDefined<Ct extends Contract = Contract> = {
  sync: (path: string) => FnR<Ct, boolean>;
  async: (path: string) => FnR<Ct, MaybePromise<boolean>>;
};

export type ValueIs<Ct extends Contract = Contract> = {
  sync: (path: string, ...values: any[]) => FnR<Ct, boolean>;
  async: (path: string, ...values: any[]) => FnR<Ct, MaybePromise<boolean>>;
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
