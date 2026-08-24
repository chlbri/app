import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
  StateValue,
} from '@bemedev/app';
import { expandFn } from '@bemedev/app/bemedev';
import { decomposeSV, deepEqual } from '@bemedev/app/utils';
import { createSignal, onCleanup } from 'solid-js';

/**
 * SolidJS primitive that creates reactive signal helpers for checking active state hierarchy.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 *
 * @param service - Service object containing `subscribe` and `state`.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 * @param equals - Optional equality comparator function for state comparison.
 *
 * @returns Object helper with `or` and `and` methods returning signals.
 *
 * @see {@linkcode decomposeSV}, {@linkcode expandFn}, {@linkcode createSignal}, {@linkcode onCleanup}, {@linkcode deepEqual}
 */
export function createIsInside<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: { subscribe: AddSubscriber_F<Tc, Ta, Eo>; state: State<Eo, Tc, Ta> }) {
  const selector1 = (value: StateValue) => {
    return decomposeSV(value);
  };

  const dispatch = (matcher: 'some' | 'every') => {
    return (...states: string[]) => {
      const selector = () => {
        return states[matcher](state =>
          selector1(service.state.value).includes(state),
        );
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
