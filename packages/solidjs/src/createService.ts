import type {
  AddSubscriber_F,
  EventObject,
  PrimitiveObject,
  State,
} from '@bemedev/app';
import { createCan } from './createCan';
import { createIsInside } from './createIsInside';
import { createState } from './createState';
import type { CreateStateOptions } from './types';

/**
 * SolidJS primitive that binds state signals, event checking, and hierarchy querying for a service.
 *
 * @template | {@linkcode PrimitiveObject} `Tc` - Context type extending type {@linkcode PrimitiveObject}.
 * @template `Ta` - Tag type extending `string`.
 * @template | {@linkcode EventObject} `Eo` - Event object type extending type {@linkcode EventObject}.
 *
 * @param service - Service instance containing `subscribe`, `state`, and `canEvents`.
 * @param service.subscribe - Subscription function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state of type {@linkcode State}.
 * @param service.canEvents - Method to check event execution capability.
 *
 * @returns Service hooks object containing `state`, `can`, and `isInside`.
 *
 * @see {@linkcode createState}, {@linkcode createCan}, {@linkcode createIsInside}, -- type {@linkcode CreateStateOptions}
 */
export function createService<
  Tc extends PrimitiveObject,
  Ta extends string,
  Eo extends EventObject,
>(service: {
  subscribe: AddSubscriber_F<Tc, Ta, Eo>;
  state: State<Eo, Tc, Ta>;
  canEvents: (...events: Eo['type'][]) => boolean;
}) {
  return {
    state: <T = State<Eo, Tc, Ta>>(options?: CreateStateOptions<Tc, Ta, Eo, T>) => {
      return createState<Tc, Ta, Eo, T>(service, options);
    },

    can: createCan(service),
    isInside: createIsInside(service),
  };
}

/**
 * Alias for function {@linkcode createService}.
 */
export const createHooks = createService;
