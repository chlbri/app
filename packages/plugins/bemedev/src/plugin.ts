import { createUtilities, same } from '@bemedev/app-plugins';
import { swap } from './swap';
export type { Swap_F } from './swap';

/**
 * Options plugin adding the `swap` helper to the options surface.
 *
 * The helper left the default helpers, so it is opted in through the plugin
 * system, either with `createOptions(contract).use(plugin)` or with the
 * `plugins` entry of the machine types.
 *
 * @example
 * ```ts
 * import { createOptions } from '@bemedev/app-options';
 * import { plugin } from '@bemedev/app-bemedev-plugins';
 *
 * const options = createOptions(contract).use(plugin)(({ swap }) => ({
 *   actions: {
 *     increment: swap((value: number) => value + 1)({
 *       '[0]': '[0].context',
 *     }),
 *   },
 * }));
 * ```
 */
export const plugin = createUtilities({}, () => ({ swap: same(swap) }));

/** Type of the plugin returned by {@linkcode plugin}. */
export type Plugin = typeof plugin;
