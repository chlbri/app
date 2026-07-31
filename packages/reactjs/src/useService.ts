import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import type { UseServiceOptions } from './types';
import { useCan } from './useCan';
import { useIsInside } from './useIsInside';
import { useState } from './useState';

export function useService<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: {
  subscribe: AddSubscriber_F<Tc, Ta, Eo>;
  state: State<Eo, Tc, Ta>;
  canEvent: (event: Eo['type']) => boolean;
}) {
  return {
    state: <T = State<Eo, Tc, Ta>>(
      options?: UseServiceOptions<Tc, Ta, Eo, T>,
    ) => useState<Tc, Ta, Eo, T>(service, options),

    can: useCan(service),
    isInside: useIsInside(service),
  };
}

export const createHooks = useService;
