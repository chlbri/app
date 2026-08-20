import type { Fn } from '@bemedev/app-utils-bemedev';
import { DEFAULT_DELIMITER } from '#constants';
import type { StateValue } from '#states';

/**
 * Function type signature for recomposing a string into a type {@linkcode StateValue}.
 *
 * @param arg - The string to recompose.
 * @param delimiter - Optional delimiter used to split the string. Defaults to constant {@linkcode DEFAULT_DELIMITER}.
 *
 * @returns The recomposed type {@linkcode StateValue}.
 */
export type RecomposeSV_F = Fn<[arg: string, delimiter?: string], StateValue>;

/**
 * Recombines a string into a type {@linkcode StateValue} object using constant {@linkcode DEFAULT_DELIMITER}.
 *
 * @param arg - The string to recompose.
 * @param delimiter - The delimiter used to split the string. Defaults to constant {@linkcode DEFAULT_DELIMITER}.
 *
 * @returns An object with the first part as the key and the recomposed value as the value.
 *
 * @see type {@linkcode RecomposeSV_F}
 */
export const recomposeSV: RecomposeSV_F = (arg, delimiter = DEFAULT_DELIMITER) => {
  const arg1 = arg.startsWith(delimiter) ? arg.substring(1) : arg;

  const splits = arg1.split(delimiter);

  const check2 = splits.length === 1;
  if (check2) return arg1;

  const first = splits.shift()!;

  const rest = splits.join(delimiter);
  return { [first]: recomposeSV(rest) };
};
