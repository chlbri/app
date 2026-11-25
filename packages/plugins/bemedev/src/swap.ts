import type { Contract, FnR } from '@bemedev/app-contract';
import { reduceFnMap } from '@bemedev/app-plugins/internal';
import { swap as _swap } from '@bemedev/function-swap';

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
export type Swap_F<Ct extends Contract = Contract> = <
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
 *
 * @example
 * ```ts
 * import { swap } from '@bemedev/app-bemedev-plugins';
 *
 * const inc = swap((value: number) => value + 1)({
 *   '[0]': '[0].context',
 * });
 * ```
 *
 * @see -- type {@linkcode Swap_F}
 */
export const swap: Swap_F = (fn, event) => types => {
  const swapped = _swap(fn).constraint()(types);
  return event ? reduceFnMap({ [event]: swapped }, event) : swapped;
};
