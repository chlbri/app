import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { deepEqual } from '@bemedev/app';
import { useEffect, useRef, useState as useReactState } from 'react';
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
    equals: equality = deepEqual<T>,
  } = options ?? {};

  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const equalityRef = useRef(equality);
  equalityRef.current = equality;

  const [_state, setState] = useReactState<T>(() =>
    selectorRef.current(service.state),
  );

  const sub = service.subscribe(
    nextState => {
      setState(selectorRef.current(nextState));
    },
    {
      equals: (first, next) => {
        const _first = selectorRef.current(first);
        const _next = selectorRef.current(next);
        return equalityRef.current(_first, _next);
      },
    },
  );

  useEffect(() => sub.unsubscribe, []);
  return _state;
}
