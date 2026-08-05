import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { expandFn } from '@bemedev/app/bemedev';
import { decomposeSV, deepEqual } from '@bemedev/app/utils';
import { useSync } from '@bemedev/react-sync';

export function useIsInside<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: {
  subscribe: AddSubscriber_F<Tc, Ta, Eo>;
  state: State<Eo, Tc, Ta>;
}) {
  const selector1 = (_state: State<Eo, Tc, Ta>) => {
    return decomposeSV(_state.value);
  };

  const dispatch = (matcher: 'some' | 'every') => {
    return (...states: string[]) => {
      return useSync(
        listener => {
          const { unsubscribe } = service.subscribe(listener, {
            equals: (first, next) => deepEqual(first.value, next.value),
          });
          return unsubscribe;
        },
        () => service.state,
        () => service.state,
        _state => {
          return states[matcher](state =>
            selector1(_state).includes(state),
          );
        },
      );
    };
  };

  const or = dispatch('some');
  const and = dispatch('every');
  const out = expandFn(and, { or, and });
  return out;
}
