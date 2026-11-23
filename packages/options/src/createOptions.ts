import type { Contract } from '@bemedev/app-contract';
import { createUtilities, type Addons } from '@bemedev/app-utility';

import { buildHelpers } from './internal';
import type { CreateOptionsWith, UseBuilder } from './types';
import type { OptionsPlugin } from './utility/plugin';

export type {
  AsyncOptionsHelpers,
  CreateOptionsWith,
  LegacyOptions,
  OptionsHelper,
  OptionsHelpers,
  SyncOptionsHelpers,
  UseBuilder,
  UseHelpers,
} from './types';

export * from '@bemedev/app-contract';

/**
 * Curried `createOptions` signature.
 *
 * The returned function accepts an options callback and produces the machine
 * options object, typed with the contract option surface. Plugins are chained
 * with `use`, either as maps or through an inline builder.
 *
 * @example
 * ```ts
 * const options = createOptions(contract)(({ assign }) => ({
 *   actions: { increment: assign('context.count', ({ context }) => context.count + 1) },
 * }));
 * ```
 *
 * @example
 * ```ts
 * const options = createOptions(contract).use(retryPlugin)(({ retry }) => ({
 *   actions: { load: retry(3, fetchAction) },
 * }));
 * ```
 */
export type CreateOptions_F = <const C extends Contract>(
  contract: C,
) => CreateOptionsWith<C, readonly [OptionsPlugin<Addons<C>, C>]>;

/** Item accepted by `use`: a plugin map or an inline builder. */
type UseItem = OptionsPlugin<any, any> | UseBuilder<any, any>;

/**
 * Normalizes a `use` item to a plugin.
 *
 * An inline builder is wrapped in a lazy `createUtilities` plugin, so the
 * engine resolves it with the utilities built so far like any other plugin.
 *
 * @param item - Plugin map or inline builder.
 * @param contract - Contract forwarded to the inline builder.
 *
 * @returns The plugin resolving the item.
 */
const toPlugin = (item: UseItem, contract: Contract): OptionsPlugin<any, any> => {
  if (typeof item !== 'function') return item;

  return createUtilities({ contract }, ({ contract, utilities }) =>
    item({ contract, utilities }),
  );
};

/**
 * Builds the options callable of a contract.
 *
 * @param contract - Contract created with `createContract`.
 * @param plugins - Plugins applied to this callable.
 *
 * @returns The callable, extended with `use`.
 */
const builder = (
  contract: Contract,
  plugins: readonly OptionsPlugin<any, any>[],
): CreateOptionsWith<any, any> => {
  const legacyOptions = Object.freeze({ _legacy: Object.freeze({}) }) as any;

  const callable = (helper: (options: any, legacy: any) => any) =>
    helper(buildHelpers({ contract, plugins }), legacyOptions);

  return Object.assign(callable, {
    use: (...more: readonly UseItem[]) =>
      builder(contract, [...plugins, ...more.map(item => toPlugin(item, contract))]),
  }) as CreateOptionsWith<any, any>;
};

/**
 * Creates machine options from a contract, without a machine instance.
 *
 * The returned function receives the same helpers as
 * `machine.createOptions` and produces the contract options object. Plugins
 * are chained with `.use()`, either as maps or through an inline builder
 * receiving the contract and the utilities built so far.
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
export const createOptions: CreateOptions_F = (contract =>
  builder(contract, [])) as CreateOptions_F;
