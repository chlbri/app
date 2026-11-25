import type { AddSubscriber_F } from '@bemedev/app/types';
import { expandFn } from '@bemedev/app-utils-bemedev';
import type { State, Contract, StateValue } from '@bemedev/app-contract';
import { deepEqual } from '@bemedev/app/utils';
import { decomposeSV } from '@bemedev/decompose';
import { createSignal, onCleanup } from 'solid-js';

/**
 * SolidJS primitive that creates reactive signal helpers for checking active state hierarchy.
 *
 * Every type is derived from the contract of the service.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the service.
 *
 * @param service - Service object containing `subscribe` and `state`.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state derived from the contract.
 *
 * @returns Object helper with `or` and `and` methods returning signals.
 *
 * @see {@linkcode decomposeSV}, {@linkcode expandFn}, {@linkcode createSignal}, {@linkcode onCleanup}, {@linkcode deepEqual}
 */
export function createIsInside<const Ct extends Contract = Contract>(service: {
  subscribe: AddSubscriber_F<Ct>;
  state: State<Ct>;
}) {
  const selector1 = (value: StateValue) => {
    return decomposeSV(value);
  };

  const dispatch = (matcher: 'some' | 'every') => {
    return (...states: string[]) => {
      const selector = () => {
        return states[matcher](state =>
          selector1(service.state.value).includes(state),
        );
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
