import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app/types';
import { deepEqual } from '@bemedev/app/utils';
import { useEffect, useState } from 'react';

/**
 * A hook that creates a React state from a service with a subscribe function.
 *
 * @param service - The service containing the state and subscribe method.
 * @param selector - A function to select the desired slice of state.
 * @returns The selected state.
 */
export function useService<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
>(
  service: {
    subscribe: AddSubscriber_F<Tc, Ta, Eo>;
    state: State<Eo, Tc, Ta>;
  },
  selector: (state: State<Eo, Tc, Ta>) => T = (s: State<Eo, Tc, Ta>) =>
    s as unknown as T,
): T {
  const [state, setState] = useState<T>(() => selector(service.state));

  const sub = service.subscribe(
    nextState => setState(selector(nextState)),
    {
      equals: (first, next) => {
        const _first = selector(first);
        const _next = selector(next);
        return deepEqual(_first, _next);
      },
    },
  );

  useEffect(() => sub.unsubscribe, [service, selector]);
  return state;
}
