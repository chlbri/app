import {
  type AddSubscriber_F,
  type EventObject,
  type PrimitiveObject,
  type State,
} from '@bemedev/app';
import { expandFn } from '@bemedev/app/bemedev';
import { deepEqual, identity } from '@bemedev/app/utils';
import { useSync } from '@bemedev/react-sync';

export function useCan<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: {
  subscribe: AddSubscriber_F<Tc, Ta, Eo>;
  state: State<Eo, Tc, Ta>;
  canEvents: (...events: Eo['type'][]) => boolean;
}) {
  const dispatch =
    (matcher: 'some' | 'every') =>
    (...events: Eo['type'][]) => {
      const selector = () =>
        events[matcher](event => service.canEvents(event));
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

  const or = dispatch('some');
  const and = dispatch('every');
  const out = expandFn(and, { or, and });
  return out;
}
