import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
  StateValue,
} from '@bemedev/app';
import { expandFn } from '@bemedev/app/bemedev';
import { decomposeSV, deepEqual, identity } from '@bemedev/app/utils';
import { useSync } from '@bemedev/react-sync';

/**
 * React hook that creates reactive helpers for checking active state hierarchy.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 *
 * @param service - Service object containing `subscribe` and `state`.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 *
 * @returns Object helper with `or` and `and` methods to check state hierarchy.
 *
 * @see {@linkcode decomposeSV}, {@linkcode useSync}, {@linkcode expandFn}, {@linkcode deepEqual}, {@linkcode identity}
 */
export function useIsInside<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: { subscribe: AddSubscriber_F<Tc, Ta, Eo>; state: State<Eo, Tc, Ta> }) {
  const selector1 = (value: StateValue) => {
    return decomposeSV(value);
  };

  const dispatch = (matcher: 'some' | 'every') => {
    return (...states: string[]) => {
      const selector = () =>
        states[matcher](state => selector1(service.state.value).includes(state));
      return useSync(
        listener => {
          const { unsubscribe } = service.subscribe(listener, {
            equals: (first, next) => deepEqual(first.value, next.value),
            firstTime: true,
          });

          return unsubscribe;
        },
        selector,
        selector,
        identity,
      );
    };
  };

  const or = dispatch('some');
  const and = dispatch('every');
  const out = expandFn(and, { or, and });
  return out;
}
