import type { AddSubscriber_F, Contract, MachineStateOf } from '@bemedev/app';
import { deepEqual, identity } from '@bemedev/app/utils';
import { createSignal, onCleanup } from 'solid-js';
import type { CreateStateOptions } from './types';

/**
 * A SolidJS primitive that creates a reactive signal from a service with a subscribe function.
 *
 * Every type is derived from the contract of the service.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the service.
 * @template `T` - Selected state type, defaults to the contract state.
 *
 * @param service - The service containing state and subscribe method.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state derived from the contract.
 * @param options - Optional configuration options of type {@linkcode CreateStateOptions}.
 * @param options.selector - Optional selector function projecting the state into a sub-state.
 * @param options.equals - Optional equality comparator for the selected state.
 * @param options.stateEquals - Optional equality comparator for the machine state before selection.
 *
 * @returns A SolidJS Accessor containing the selected state of type `T`.
 *
 * @see {@linkcode createSignal}, {@linkcode onCleanup}, {@linkcode deepEqual}, {@linkcode identity}
 */
export function createState<
  const Ct extends Contract = Contract,
  T = MachineStateOf<Ct>,
>(
  service: { subscribe: AddSubscriber_F<Ct>; state: MachineStateOf<Ct> },
  options?: CreateStateOptions<Ct, T>,
) {
  const {
    selector = identity,
    equals = deepEqual,
    stateEquals = deepEqual,
  } = options ?? {};

  const [state, setState] = createSignal<T>(selector(service.state) as any, {
    equals,
  });

  const sub = service.subscribe(nextState => setState(() => selector(nextState)), {
    equals: stateEquals,
  });

  onCleanup(sub.unsubscribe);
  return state;
}
