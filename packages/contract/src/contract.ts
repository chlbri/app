import type { CreateContract_F } from './types';

/**
 * Runtime shape produced by the contract factory.
 *
 * @param name - Contract identifier.
 * @param config - Machine JSON configuration.
 * @param types - Optional type schemas.
 */
const createContractImpl = (name: any, config: any, types?: any) =>
  Object.freeze({ name, config, types: types ?? {} });

/**
 * Registers a lightweight state machine contract: its JSON config and types
 * only, never its option implementations.
 *
 * A contract is meant to be shared with API layers (or any consumer that only
 * needs the machine's typing surface) without pulling in actions, guards,
 * delays or actors.
 *
 * @param name - Contract identifier.
 * @param config - Machine JSON configuration.
 * @param types - Optional type schemas matching `createMachine`'s `types`.
 *
 * @returns A frozen contract object of type {@linkcode Contract}.
 *
 * @example
 * ```ts
 * import { createContract } from '@bemedev/app-contract';
 * import { type } from '@bemedev/typings';
 *
 * export const authContract = createContract(
 *   'auth',
 *   {
 *     initial: 'idle',
 *     states: {
 *       idle: { on: { LOGIN: '/authenticated' } },
 *       authenticated: {},
 *     },
 *   },
 *   {
 *     eventsMap: type({ LOGIN: { email: 'string' } }),
 *   },
 * );
 * ```
 *
 * @see {@linkcode CreateContract_F}, {@linkcode Contract}
 */
export const createContract = createContractImpl as CreateContract_F;
