import type { CreateContract_F } from './contract.types';

const createContractImpl = (
  nameOrConfig: any,
  configOrTypes?: any,
  maybeTypes?: any,
) => {
  const named = typeof nameOrConfig === 'string';
  const config = named ? configOrTypes : nameOrConfig;
  const types = (named ? maybeTypes : configOrTypes) ?? {};

  return Object.freeze({ config, types });
};

/**
 * Registers a lightweight state machine contract: its JSON config, its types
 * and the options surface a machine can expose.
 *
 * A contract is meant to be shared with API layers (or any consumer that only
 * needs the machine's typing surface) without pulling in actions, guards,
 * delays or actors.
 *
 * @param nameOrConfig - Contract identifier (named form) or machine JSON config (unnamed form).
 * @param configOrTypes - Machine JSON config (named form) or type schemas (unnamed form).
 * @param maybeTypes - Optional type schemas matching `createMachine`'s `types`.
 *
 * @returns A frozen contract object of type {@linkcode Contract}.
 *
 * @example
 * ```ts
 * import { createContract } from '@bemedev/app-contract';
 * import { type } from '@bemedev/typings';
 *
 * export const authContract = createContract(
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
 * @example
 * ```ts
 * // Registered form: paths, events and option names come from `Register`.
 * export default createContract('auth', config, types);
 * ```
 *
 * @see -- type {@linkcode CreateContract_F}
 */
export const createContract = createContractImpl as CreateContract_F;
