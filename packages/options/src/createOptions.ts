import type { Contract } from '@bemedev/app-contract';

import { buildHelpers } from './internal';
import type { OptionsPlugin } from './plugins';
import type { CreateOptions_F, CreateOptionsWith } from './types';

export type {
  AsyncOptions,
  AsyncOptionsHelpers,
  CreateOptions_F,
  CreateOptionsWith,
  LegacyOptions,
  OptionsHelper,
  OptionsHelpers,
  SyncOptionsHelpers,
} from './types';

export * from '@bemedev/app-contract';

/**
 * Builds the options callable of a contract.
 *
 * @param contract - Contract created with `createContract`.
 * @param plugins - Plugins applied to this callable.
 *
 * @returns The callable, extended with `use` and `useAll`.
 */
const builder = (
  contract: Contract,
  plugins: readonly OptionsPlugin<any, any>[],
): CreateOptionsWith<any, any> => {
  const legacyOptions = Object.freeze({ _legacy: Object.freeze({}) }) as any;

  const callable = (helper: (options: any, legacy: any) => any) =>
    helper(
      buildHelpers({ contract, plugins, legacy: legacyOptions }),
      legacyOptions,
    );

  return Object.assign(callable, {
    use: (plugin: OptionsPlugin<any, any>) =>
      builder(contract, [...plugins, plugin]),
    useAll: (more: readonly OptionsPlugin<any, any>[]) =>
      builder(contract, [...plugins, ...more]),
  }) as CreateOptionsWith<any, any>;
};

/**
 * Creates machine options from a contract, without a machine instance.
 *
 * The returned function receives the same helpers as
 * `machine.createOptions` and produces the contract options object. Plugins
 * can be passed directly or chained with `.use()` / `.useAll()`.
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
export const createOptions = ((
  contract: Contract,
  ...plugins: readonly OptionsPlugin<any, any>[]
) => builder(contract, plugins)) as CreateOptions_F;
