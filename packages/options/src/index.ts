import type { Contract } from '@bemedev/app-contract';

import { createAsyncHelpers, createSyncHelpers } from './internal';
import type { CreateOptions_F } from './types';

export type {
  AsyncOptions,
  AsyncOptionsHelpers,
  CreateOptions_F,
  LegacyOptions,
  OptionsHelper,
  SyncOptionsHelpers,
} from './types';

export * from '@bemedev/app-contract';

/**
 * Builds the options surface of a contract at runtime.
 *
 * The contract's `sync` flag selects the synchronous or the asynchronous
 * helper set, so a single entry point covers both machine flavors.
 *
 * @param contract - Contract created with `createContract`.
 *
 * @returns A function accepting the options callback.
 */
const builder = (contract: Contract) => {
  const sync = contract.types?.sync === true;
  const helpers = sync
    ? createSyncHelpers(contract.config)
    : createAsyncHelpers(contract.config);

  const legacyOptions = Object.freeze({ _legacy: Object.freeze({}) }) as any;

  return (helper: (option: any, legacyOptions: any) => any) =>
    helper(helpers, legacyOptions);
};

/**
 * Creates machine options from a contract, without a machine instance.
 *
 * The returned function receives the same helpers as
 * `machine.createOptions` and produces the contract options object.
 *
 * @example
 * ```ts
 * import { createContract } from '@bemedev/app-contract';
 * import { createOptions } from '@bemedev/app-options';
 *
 * const contract = createContract(
 *   {
 *     initial: 'idle',
 *     states: { idle: { on: { INC: '/idle' } } },
 *   },
 *   { context: type({ count: 'number' }), sync: true },
 * );
 *
 * const options = createOptions(contract)(({ assign }) => ({
 *   actions: {
 *     increment: assign('context.count', ({ context }) => context.count + 1),
 *   },
 * }));
 * ```
 *
 * @see -- type {@linkcode CreateOptions_F}
 */
export const createOptions = ((contract: Contract) =>
  builder(contract)) as CreateOptions_F;
