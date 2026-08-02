import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { deepEqual } from '@bemedev/app/utils';
import { useCallback, useEffect, useState as useReactState } from 'react';
import type { UseServiceOptions } from './types';

/**
 * A hook that creates a React state from a service with a subscribe function.
 *
 * @param service - The service containing the state and subscribe method.
 * @param options - Optional configuration options for selection and equality comparison.
 * @returns The selected state.
 */
export function useState<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
>(
  service: {
    subscribe: AddSubscriber_F<Tc, Ta, Eo>;
    state: State<Eo, Tc, Ta>;
  },
  options?: UseServiceOptions<Tc, Ta, Eo, T>,
): T {
  const {
    selector = (s: State<Eo, Tc, Ta>) => s as T,
    equals = deepEqual<T>,
  } = options ?? {};

  const [_state, setState] = useReactState<T>(() =>
    selector(service.state),
  );

  const _selector = useCallback(selector, [selector]);
  const _equals = useCallback(equals, [equals]);

  const sub = service.subscribe(
    nextState => setState(_selector(nextState)),
    {
      equals: (prev, next) => {
        const _prev = _selector(prev);
        const _next = _selector(next);
        return _equals(_prev, _next);
      },
    },
  );

  useEffect(() => sub.unsubscribe, []);
  return _state;
}
