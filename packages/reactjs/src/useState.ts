import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { deepEqual } from '@bemedev/app/utils';
import { useSync } from '@bemedev/react-sync';
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

  return useSync(
    listener => {
      const { unsubscribe } = service.subscribe(listener, {
        equals: (prev, next) => {
          const _prev = selector(prev);
          const _next = selector(next);
          return equals(_prev, _next);
        },
      });
      return unsubscribe;
    },
    () => service.state,
    () => service.state,
    selector,
    equals,
  );
}
