import type { Contract } from '@bemedev/app-options';
import type { FnMap } from '~types';

export type { DelayFunction2, DelayFunction3 } from '@bemedev/app-options';

/**
 * Delay type definition.
 * The function takes in a context object and returns a delay in milliseconds.
 *
 * Synchronous and asynchronous machines share the same delay signature, so a
 * single type covers both flavors.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 *
 * @returns A number or a {@linkcode FnMap} function that returns a number.
 */
export type DelayFunction<Ct extends Contract = Contract> =
  | number
  | FnMap<Ct, number>;

/**
 * Delay configuration map.
 * Maps a string key to a {@linkcode DelayFunction} function.
 *
 * @template | {@linkcode Contract} `Ct` - Contract of the machine.
 */
export type DelayMap<Ct extends Contract = Contract> = Partial<
  Record<string, DelayFunction<Ct>>
>;
