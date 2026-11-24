import type { Contract, State } from '@bemedev/app-contract';
import type { Dequal_F } from '@bemedev/app/types';

/**
 * Options for configuring state selectors and equality comparators used by
 * {@linkcode createState} signals.
 *
 * Every type is derived from the contract of the service.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the service.
 * @template `T` - Selected state type, defaults to the contract state.
 *
 * @property selector - Optional selector function to project the state into a sub-state.
 * @property equals - Optional equality comparator function to compare previous and next selected state.
 * @property stateEquals - Optional equality comparator function to compare previous and next machine state before selection.
 */
export type CreateStateOptions<Ct extends Contract = Contract, T = State<Ct>> = {
  selector?: (state: State<Ct>) => T;
  equals?: Dequal_F<T>;
  stateEquals?: Dequal_F<State<Ct>>;
};

/**
 * Type alias for type {@linkcode CreateStateOptions}.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the service.
 * @template `T` - Selected state type, defaults to the contract state.
 */
export type CreateServiceOptions<
  Ct extends Contract = Contract,
  T = State<Ct>,
> = CreateStateOptions<Ct, T>;
