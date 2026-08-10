import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { expandFn } from '@bemedev/app/bemedev';
import { createSignal, onCleanup } from 'solid-js';

/**
 * SolidJS hook that creates reactive signal helpers for querying event capabilities from a service.
 *
 * @template {PrimitiveObject} Tc - Context type extending type {@linkcode PrimitiveObject}.
 * @template {string} Ta - Tag type extending `string`.
 * @template {EventObject} Eo - Event object type extending type {@linkcode EventObject}.
 *
 * @param service - Service object containing `subscribe`, `state`, and `canEvents`.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 * @param service.canEvents - Function checking if event types can be accepted.
 *
 * @returns Object helper with `or` and `and` methods returning signals.
 */
export function useCan<
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
      const selector = (_state: State<Eo, Tc, Ta>) => {
        return events[matcher](event => service.canEvents(event));
      };

      const [_state, setState] = createSignal(selector(service.state));

      const sub = service.subscribe(() => {
        setState(() => selector(service.state));
      });

      onCleanup(sub.unsubscribe);
      return _state;
    };
  };

  const or = dispatch('some');
  const and = dispatch('every');
  const out = expandFn(and, { or, and });
  return out;
}
