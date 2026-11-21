import type {
  EventObject,
  FnR,
  MaybePromise,
  PrimitiveObject,
} from "@bemedev/app-contract";

export type ValueDefined<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  sync: (path: string) => FnR<E, Pc, Tc, T, boolean>;
  async: (path: string) => FnR<E, Pc, Tc, T, MaybePromise<boolean>>;
};

export type ValueIs<
  E extends EventObject = EventObject,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
> = {
  sync: (path: string, ...values: any[]) => FnR<E, Pc, Tc, T, boolean>;
  async: (
    path: string,
    ...values: any[]
  ) => FnR<E, Pc, Tc, T, MaybePromise<boolean>>;
};
