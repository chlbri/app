import type { AddSubscriber_F } from '@bemedev/app/types';
import type { Contract, State, ContractEventType } from '@bemedev/app-contract';
import type { UseStateOptions } from './types';
import { useCan } from './useCan';
import { useIsInside } from './useIsInside';
import { useState } from './useState';

/**
 * React hook that binds state management, event checking, and hierarchy querying for a service.
 *
 * Every type is derived from the contract of the service.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the service.
 *
 * @param service - Service instance containing `subscribe`, `state`, and `canEvents`.
 * @param service.subscribe - Subscription handler function of type {@linkcode AddSubscriber_F}.
 * @param service.state - Current state derived from the contract.
 * @param service.canEvents - Method to check event execution capability.
 *
 * @returns Service hooks object containing `state`, `can`, and `isInside`.
 *
 * @see {@linkcode useState}, {@linkcode useCan}, {@linkcode useIsInside}, -- type {@linkcode UseStateOptions}
 */
export function useService<const Ct extends Contract = Contract>(service: {
  subscribe: AddSubscriber_F<Ct>;
  state: State<Ct>;
  canEvents: (...events: ContractEventType<Ct>[]) => boolean;
}) {
  return {
    state: <T = State<Ct>>(options?: UseStateOptions<Ct, T>) => {
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
