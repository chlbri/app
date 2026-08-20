import {
  type AddSubscriber_F,
  type EventObject,
  type PrimitiveObject,
  type State,
} from '@bemedev/app';
import { deepEqual, identity } from '@bemedev/app/utils';
import { useSync } from '@bemedev/react-sync';
import type { UseServiceOptions } from './types';

/**
 * A hook that creates a React state from a service with a subscribe function.
 *
 * @template {PrimitiveObject} Tc - Context type extending type {@linkcode PrimitiveObject}.
 * @template {string} Ta - Tag type extending `string`.
 * @template {EventObject} Eo - Event object type extending type {@linkcode EventObject}.
 * @template T - Selected state type, defaults to type {@linkcode State}<{@linkcode Eo}, {@linkcode Tc}, {@linkcode Ta}>.
 *
 * @param service - The service containing state and subscribe method.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 * @param options - Optional configuration options of type {@linkcode UseServiceOptions}.
 *
 * @returns The selected state of type `T`.
 */
export function useState<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
>(
  service: { subscribe: AddSubscriber_F<Tc, Ta, Eo>; state: State<Eo, Tc, Ta> },
  options?: UseServiceOptions<Tc, Ta, Eo, T>,
): T {
  const { selector = identity, equals = deepEqual<T> } = options ?? {};
  const _selector = () => selector(service.state);

  return useSync(
    listener => {
      const { unsubscribe } = service.subscribe(listener, {
        equals: (prev, next) => {
          const _prev = selector(prev);
          const _next = selector(next);
          return equals(_prev, _next);
        },
        firstTime: true,
      });
      return unsubscribe;
    },
    _selector,
    _selector,
    identity,
    equals,
  );
}
