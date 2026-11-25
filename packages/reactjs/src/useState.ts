import type { AddSubscriber_F } from '@bemedev/app/types';
import type { Contract, State } from '@bemedev/app-contract';
import { deepEqual } from '@bemedev/app/utils';
import { identity } from '@bemedev/app-contract/bemedev';
import { useSync } from '@bemedev/react-sync';
import type { UseStateOptions } from './types';

/**
 * A hook that creates a React state from a service with a subscribe function.
 *
 * Every type is derived from the contract of the service.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the service.
 * @template `T` - Selected state type, defaults to the contract state.
 *
 * @param service - The service containing state and subscribe method.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state derived from the contract.
 * @param options - Optional configuration options of type {@linkcode UseStateOptions}.
 * @param options.selector - Optional selector function projecting the state into a sub-state.
 * @param options.equals - Optional equality comparator for the selected state.
 * @param options.stateEquals - Optional equality comparator for the machine state before selection.
 *
 * @returns The selected state of type `T`.
 *
 * @see {@linkcode useSync}, {@linkcode deepEqual}, {@linkcode identity}
 */
export function useState<const Ct extends Contract = Contract, T = State<Ct>>(
  service: { subscribe: AddSubscriber_F<Ct>; state: State<Ct> },
  options?: UseStateOptions<Ct, T>,
): T {
  const {
    selector = identity,
    equals = deepEqual,
    stateEquals = deepEqual,
  } = options ?? {};
  const _selector = () => selector(service.state);

  return useSync(
    listener => {
      const { unsubscribe } = service.subscribe(listener, {
        equals: stateEquals,
        firstTime: true,
      });

      return unsubscribe;
    },
    _selector,
    _selector,
    identity as any,
    equals,
  );
}
