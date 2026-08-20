import type { Fn } from '@bemedev/app-utils-bemedev';
import { DEFAULT_DELIMITER } from '#constants';

/**
 * Function type signature for deleting the first occurrence of a delimiter from a string.
 *
 * @param arg - The string from which to delete the first occurrence of the specified delimiter.
 * @param toDelete - Optional delimiter to remove. Defaults to constant {@linkcode DEFAULT_DELIMITER}.
 *
 * @returns The modified string with the first occurrence removed.
 */
export type DeleteFirst_F = Fn<[arg: string, toDelete?: string], string>;

/**
 * Deletes the first occurrence of a specified delimiter from the start of a string.
 *
 * @param arg - The string from which to delete the first occurrence of the specified delimiter.
 * @param toDelete - The delimiter to remove from the start of the string. Defaults to constant {@linkcode DEFAULT_DELIMITER}.
 *
 * @returns The modified string with the first occurrence of the specified value removed, or the original string if the delimiter is not found at the start.
 *
 * @see {@linkcode DeleteFirst_F}
 */
export const deleteFirst: DeleteFirst_F = (arg, toDelete = DEFAULT_DELIMITER) => {
  const check = arg.startsWith(toDelete);
  return check ? arg.substring(1) : arg;
};
