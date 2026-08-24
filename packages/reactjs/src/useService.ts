import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import type { UseStateOptions } from './types';
import { useCan } from './useCan';
import { useIsInside } from './useIsInside';
import { useState } from './useState';
/**
 * React hook that binds state management, event checking, and hierarchy querying for a service.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 *
 * @param service - Service instance containing `subscribe`, `state`, and `canEvents`.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 * @param service.canEvents - Method to check event execution capability.
 *
 * @returns Service hooks object containing `state`, `can`, and `isInside`.
 *
 * @see {@linkcode useState}, {@linkcode useCan}, {@linkcode useIsInside}, -- type {@linkcode UseStateOptions}
 */
export function useService<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: {
  subscribe: AddSubscriber_F<Tc, Ta, Eo>;
  state: State<Eo, Tc, Ta>;
  canEvents: (...events: Eo['type'][]) => boolean;
}) {
  return {
    state: <T = State<Eo, Tc, Ta>>(options?: UseStateOptions<Tc, Ta, Eo, T>) => {
      return useState(service, options);
    },

    can: useCan(service),
    isInside: useIsInside(service),
  };
}

/**
 * Alias for function {@linkcode useService}.
 */
export const createHooks = useService;
