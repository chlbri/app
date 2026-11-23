import { createUtilities, same } from '@bemedev/app-plugins';
import { swap } from './swap';

/**
 * Options plugin adding the `swap` helper to the options surface.
 *
 * The helper left the default helpers, so it is opted in through the plugin
 * system, either with `createOptions(contract).use(swapPlugin)` or with the
 * `plugins` entry of the machine types.
 *
 * @example
 * ```ts
 * import { createOptions } from '@bemedev/app-options';
 * import { swapPlugin } from '@bemedev/app-bemedev-plugins';
 *
 * const options = createOptions(contract).use(swapPlugin)(({ swap }) => ({
 *   actions: {
 *     increment: swap((value: number) => value + 1)({
 *       '[0]': '[0].context',
 *     }),
 *   },
 * }));
 * ```
 */
export const swapPlugin = createUtilities({}, () => ({ swap: same(swap) }));

/** Type of the plugin returned by {@linkcode swapPlugin}. */
export type SwapPlugin = typeof swapPlugin;

export const plugin = swapPlugin;

export type Plugin = SwapPlugin;
