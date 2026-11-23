import { UtilityPair } from './addons';

/**
 * Declares a utility whose synchronous and asynchronous implementations are
 * the same function.
 *
 * @template `F` - Implementation type, shared by both modes.
 *
 * @param fn - Implementation used for `sync` and `async`.
 *
 * @returns A pair pointing at the same function.
 */
export const same = <F>(fn: F): UtilityPair<F, F> => ({ sync: fn, async: fn });
