import type { Accessor } from 'solid-js';

export type State_F<T> = <const U = T>(
  accessor?: (state: T) => U,
  equals?: false | ((prev: U, next: U) => boolean),
) => Accessor<U>;

