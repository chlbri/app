import type { AddSubscriber_F } from '@bemedev/app/types';
import { expandFn } from '@bemedev/app-utils-bemedev';
import { State, Contract, ContractEventType } from '@bemedev/app-contract';
import { deepEqual } from '@bemedev/app/utils';
import { createSignal, onCleanup } from 'solid-js';

/**
 * SolidJS primitive that creates reactive signal helpers for querying event capabilities from a service.
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
 * @returns Object helper with `or` and `and` methods returning signals.
 *
 * @see {@linkcode expandFn}, {@linkcode createSignal}, {@linkcode onCleanup}, {@linkcode deepEqual}
 */
export function createCan<const Ct extends Contract = Contract>(service: {
  subscribe: AddSubscriber_F<Ct>;
  state: State<Ct>;
  canEvents: (...events: ContractEventType<Ct>[]) => boolean;
}) {
  const dispatch = (matcher: 'some' | 'every') => {
    return (...events: ContractEventType<Ct>[]) => {
      const selector = () => {
        return events[matcher](event => service.canEvents(event));
      };

      const [_state, setState] = createSignal(selector());

      const sub = service.subscribe(
        () => {
          setState(selector);
        },
        { equals: (first, next) => deepEqual(first.value, next.value) },
      );

      onCleanup(sub.unsubscribe);
      return _state;
    };
  };

  const or = dispatch('some');
  const and = dispatch('every');
  const out = expandFn(and, { or, and });
  return out;
}
