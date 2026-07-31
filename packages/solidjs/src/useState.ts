import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { deepEqual } from '@bemedev/app';
import { createSignal, onCleanup } from 'solid-js';
import type { UseServiceOptions } from './types';

/**
 * A hook that creates a SolidJS signal from a service with a subscribe function.
 *
 * @param service - The service containing the state and subscribe method.
 * @param options - Optional configuration options for selection and equality comparison.
 * @returns A SolidJS Accessor containing the selected state.
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
    canEvent: (event: Eo['type']) => boolean;
  },
  options?: UseServiceOptions<Tc, Ta, Eo, T>,
) {
  const {
    selector = (s: State<Eo, Tc, Ta>) => s as T,
    equals: equality = deepEqual<T>,
  } = options ?? {};

  const [state, setState] = createSignal<T>(selector(service.state));

  const sub = service.subscribe(
    nextState => {
      setState(() => selector(nextState));
    },
    {
      equals: (first, next) => {
        const _first = selector(first);
        const _next = selector(next);
        return equality(_first, _next);
      },
    },
  );

  onCleanup(() => sub.unsubscribe());
  return state;
}
