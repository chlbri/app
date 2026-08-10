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

export function useIsInside<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: {
  subscribe: AddSubscriber_F<Tc, Ta, Eo>;
  state: State<Eo, Tc, Ta>;
}) {
  const selector1 = (value: StateValue) => {
    return decomposeSV(value);
  };

  const dispatch = (matcher: 'some' | 'every') => {
    return (...states: string[]) => {
      const selector = () =>
        states[matcher](state =>
          selector1(service.state.value).includes(state),
        );
      return useSync(
        listener => {
          const { unsubscribe } = service.subscribe(listener, {
            equals: (first, next) => {
              return deepEqual(first.value, next.value);
            },
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
