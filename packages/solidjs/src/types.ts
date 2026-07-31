import type { EventObject, State, PrimitiveObject } from '@bemedev/app';

export type UseServiceOptions<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
> = {
  selector?: (state: State<Eo, Tc, Ta>) => T;
  equals?: (first: T, next: T) => boolean;
};
