import {
  type AddSubscriber_F,
  type EventObject,
  type PrimitiveObject,
  type State,
} from '@bemedev/app';
import { deepEqual, identity } from '@bemedev/app/utils';
import { useSync } from '@bemedev/react-sync';
import type { UseStateOptions } from './types';

/**
 * A hook that creates a React state from a service with a subscribe function.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 * @template `T` - Selected state type, defaults to type {@linkcode State}<{@linkcode Eo}, {@linkcode Tc}, {@linkcode Ta}>.
 *
 * @param service - The service containing state and subscribe method.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 * @param options - Optional configuration options of type {@linkcode UseStateOptions}.
 *
 * @returns The selected state of type `T`.
 *
 * @see {@linkcode useSync}, {@linkcode deepEqual}, {@linkcode identity}
 */
export function useState<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
>(
  service: { subscribe: AddSubscriber_F<Tc, Ta, Eo>; state: State<Eo, Tc, Ta> },
  options?: UseStateOptions<Tc, Ta, Eo, T>,
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
    identity,
    equals,
  );
}
