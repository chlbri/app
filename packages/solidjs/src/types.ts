import type { EventObject, State, PrimitiveObject } from '@bemedev/app';
import type { Dequal_F } from '@bemedev/app/types';

/**
 * Options for configuring state selectors and equality comparators.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 * @template `T` - Selected state type, defaults to type {@linkcode State}<{@linkcode Eo}, {@linkcode Tc}, {@linkcode Ta}>.
 *
 * @property selector - Optional selector function to project the state into a sub-state.
 * @property equals - Optional equality comparator function to compare previous and next selected state.
 * @property stateEquals - Optional equality comparator function to compare previous and next machine state before selection.
 */
export type CreateStateOptions<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
> = {
  selector?: (state: State<Eo, Tc, Ta>) => T;
  equals?: Dequal_F<T>;
  stateEquals?: Dequal_F<State<Eo, Tc, Ta>>;
};

/**
 * Type alias for {@linkcode CreateStateOptions}.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 * @template `T` - Selected state type, defaults to type {@linkcode State}<{@linkcode Eo}, {@linkcode Tc}, {@linkcode Ta}>.
 */
export type CreateServiceOptions<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
> = CreateStateOptions<Tc, Ta, Eo, T>;
