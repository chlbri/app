import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { expandFn } from '@bemedev/app/bemedev';
import { deepEqual } from '@bemedev/app/utils';
import { createSignal, onCleanup } from 'solid-js';

/**
 * SolidJS primitive that creates reactive signal helpers for querying event capabilities from a service.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 *
 * @param service - Service object containing `subscribe`, `state`, and `canEvents`.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 * @param service.canEvents - Function checking if event types can be accepted.
 * @param equals - Optional equality comparator function for state comparison.
 *
 * @returns Object helper with `or` and `and` methods returning signals.
 *
 * @see {@linkcode expandFn}, {@linkcode createSignal}, {@linkcode onCleanup}, {@linkcode deepEqual}
 */
export function createCan<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: {
  subscribe: AddSubscriber_F<Tc, Ta, Eo>;
  state: State<Eo, Tc, Ta>;
  canEvents: (...events: Eo['type'][]) => boolean;
}) {
  const dispatch = (matcher: 'some' | 'every') => {
    return (...events: Eo['type'][]) => {
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
