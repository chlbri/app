import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { deepEqual, identity } from '@bemedev/app/utils';
import { createSignal, onCleanup } from 'solid-js';
import type { CreateStateOptions } from './types';

/**
 * A SolidJS primitive that creates a reactive signal from a service with a subscribe function.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 * @template `T` - Selected state type, defaults to type {@linkcode State}<{@linkcode Eo}, {@linkcode Tc}, {@linkcode Ta}>.
 *
 * @param service - The service containing state and subscribe method.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 * @param options - Optional configuration options of type {@linkcode CreateStateOptions}.
 *
 * @returns A SolidJS Accessor containing the selected state of type `T`.
 *
 * @see {@linkcode createSignal}, {@linkcode onCleanup}, {@linkcode deepEqual}, {@linkcode identity}
 */
export function createState<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
  T = State<Eo, Tc, Ta>,
>(
  service: { subscribe: AddSubscriber_F<Tc, Ta, Eo>; state: State<Eo, Tc, Ta> },
  options?: CreateStateOptions<Tc, Ta, Eo, T>,
) {
  const {
    selector = identity,
    equals: equality = deepEqual,
    stateEquals = deepEqual,
  } = options ?? {};

  const [state, setState] = createSignal<T>(selector(service.state), {
    equals: equality,
  });

  const sub = service.subscribe(
    nextState => {
      setState(() => selector(nextState));
    },
    { equals: stateEquals },
  );

  onCleanup(sub.unsubscribe);
  return state;
}
