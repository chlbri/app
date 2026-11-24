import type { AddSubscriber_F } from '@bemedev/app';
import type { Contract, ContractEventType, State } from '@bemedev/app-contract';
import { createCan } from './createCan';
import { createIsInside } from './createIsInside';
import { createState } from './createState';
import type { CreateStateOptions } from './types';

/**
 * SolidJS primitive that binds state signals, event checking, and hierarchy querying for a service.
 *
 * Every type is derived from the contract of the service.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the service.
 *
 * @param service - Service instance containing `subscribe`, `state`, and `canEvents`.
 * @param service.subscribe - Subscription function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state derived from the contract.
 * @param service.canEvents - Method to check event execution capability.
 *
 * @returns Service hooks object containing `state`, `can`, and `isInside`.
 *
 * @see {@linkcode createState}, {@linkcode createCan}, {@linkcode createIsInside}, -- type {@linkcode CreateStateOptions}
 */
export function createService<const Ct extends Contract = Contract>(service: {
  subscribe: AddSubscriber_F<Ct>;
  state: State<Ct>;
  canEvents: (...events: ContractEventType<Ct>[]) => boolean;
}) {
  return {
    state: <T = State<Ct>>(options?: CreateStateOptions<Ct, T>) => {
      return createState<Ct, T>(service, options);
    },

    can: createCan(service),
    isInside: createIsInside(service),
  };
}

/**
 * Alias for function {@linkcode createService}.
 */
export const createHooks = createService;
