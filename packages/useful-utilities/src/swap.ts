import type { Contract, FnR } from '@bemedev/app-contract';
import { reduceFnMap } from '@bemedev/app-options/internal';
import { createUtilities, same } from '@bemedev/app-utility';
import { swap as _swap, type AnyFunction } from '@bemedev/function-swap';

/**
 * Signature of the {@linkcode swap} helper.
 *
 * The mapping keys are passed as decomposed paths, so the returned function
 * stays a standard machine selector of type {@linkcode FnR}.
 *
 * @remarks
 * The plugin surface is not parameterized by the consumer contract, so the
 * mapping keys are untyped. Annotate a value with `Swap<MyContract>` to keep
 * the returned selector typed against a specific contract.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type Swap<Ct extends Contract = Contract> = <
  F extends (...args: any[]) => any,
  Ev extends string = string,
>(
  fn: F,
  event?: Ev,
) => (types: any) => FnR<Ct, ReturnType<F>>;

/**
 * Remaps the arguments of a function from decomposed state paths.
 *
 * Unlike the former default helper, this function does not need the machine
 * contract: an event name scopes the swap to that event, and any other event
 * falls back to the no-op value.
 *
 * @param fn - Function to swap.
 * @param event - Optional event name scoping the swap.
 *
 * @returns A function mapping decomposed paths to the swapped function.
 */
const swapImpl = (fn: AnyFunction, event?: string) => (types: any) => {
  const swapped = _swap(fn as any).constraint()(types);
  return event ? reduceFnMap({ [event]: swapped }, event) : swapped;
};

/**
 * Swaps the parameters of a function into machine-selector arguments.
 *
 * @example
 * ```ts
 * import { swap } from '@bemedev/app-useful-utilities';
 *
 * const inc = swap((value: number) => value + 1)({
 *   '[0]': '[0].context',
 * });
 * ```
 */
export const swap = swapImpl as unknown as Swap;

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
 * import { swapPlugin } from '@bemedev/app-useful-utilities';
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
