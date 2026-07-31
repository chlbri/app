import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { decomposeSV } from '@bemedev/app';
import { expandFn } from '@bemedev/app/bemedev';
import { useEffect, useState } from 'react';

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
      const selector = (_state: State<Eo, Tc, Ta>) => {
        return states[matcher](state => selector1(_state).includes(state));
      };

      const [_state, setState] = useState(() => selector(service.state));

      const sub = service.subscribe(
        nextState => {
          setState(selector(nextState));
        },
        {
          equals: (first, next) => {
            const _first = selector(first);
            const _next = selector(next);
            return _first === _next;
          },
        },
      );

      useEffect(() => sub.unsubscribe, []);
      return _state;
    };
  };

  const or = dispatch('some');
  const and = dispatch('every');
  const out = expandFn(and, { or, and });
  return out;
}
