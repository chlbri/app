import type { Contract, ContractEventType, State } from '@bemedev/app-contract';
import type { AddSubscriber_F } from '@bemedev/app/types';
import { expandFn } from '@bemedev/app-contract/bemedev';
import { deepEqual } from '@bemedev/app/utils';
import { identity } from '@bemedev/app-contract/bemedev';
import { useSync } from '@bemedev/react-sync';

/**
 * React hook that creates reactive helpers for querying event capabilities from a service.
 *
 * Every type is derived from the contract of the service.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the service.
 *
 * @param service - Service object containing `subscribe`, `state`, and `canEvents`.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state derived from the contract.
 * @param service.canEvents - Function checking if event types can be accepted.
 *
 * @returns Object helper with `or` and `and` methods to check event availability.
 *
 * @see {@linkcode useSync}, {@linkcode expandFn}, {@linkcode deepEqual}, {@linkcode identity}
 */
export function useCan<const Ct extends Contract = Contract>(service: {
  subscribe: AddSubscriber_F<Ct>;
  state: State<Ct>;
  canEvents: (...events: ContractEventType<Ct>[]) => boolean;
}) {
  const dispatch =
    (matcher: 'some' | 'every') =>
    (...events: ContractEventType<Ct>[]) => {
      const selector = () => events[matcher](event => service.canEvents(event));
      return useSync(
        listener => {
          const { unsubscribe } = service.subscribe(listener, {
            equals: (first, next) => deepEqual(first.value, next.value),
            firstTime: true,
          });
          return unsubscribe;
        },
        selector,
        selector,
        identity,
      );
    };

  const or = dispatch('some');
  const and = dispatch('every');
  const out = expandFn(and, { or, and });
  return out;
}
