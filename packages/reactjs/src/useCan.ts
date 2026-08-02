import {
  type AddSubscriber_F,
  type EventObject,
  type PrimitiveObject,
  type State,
} from '@bemedev/app';
import { expandFn } from '@bemedev/app/bemedev';
import { deepEqual } from '@bemedev/app/utils';
import { useEffect, useState } from 'react';

export function useCan<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: {
  subscribe: AddSubscriber_F<Tc, Ta, Eo>;
  state: State<Eo, Tc, Ta>;
  canEvent: (event: Eo['type']) => boolean;
}) {
  const dispatch = (matcher: 'some' | 'every') => {
    return (...events: Eo['type'][]) => {
      const selector = (_state: State<Eo, Tc, Ta>) => {
        return events[matcher](event => service.canEvent(event));
      };

      const [_state, setState] = useState(selector(service.state));

      const sub = service.subscribe(
        () => setState(selector(service.state)),
        { equals: (first, next) => deepEqual(first.value, next.value) },
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
