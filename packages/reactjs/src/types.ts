import type { EventObject, State, PrimitiveObject } from '@bemedev/app';
import type { Dequal_F } from '@bemedev/app/types';

/**
 * Options for configuring the `useService` hook.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 * @template `T` - Selected state type, defaults to type {@linkcode State}<{@linkcode Eo}, {@linkcode Tc}, {@linkcode Ta}>.
 *
 * @property selector - Optional selector function to project the state into a sub-state.
 * @property equals - Optional equality comparator function to compare previous and next selected state.
 */
export type UseStateOptions<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
> = {
  selector?: (state: State<Eo, Tc, Ta>) => T;
  equals?: Dequal_F<T>;
  stateEquals?: Dequal_F<State<Eo, Tc, Ta>>;
};
