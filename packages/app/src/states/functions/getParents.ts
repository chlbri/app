import { DEFAULT_DELIMITER } from '#constants';
import { isStringEmpty } from '#utils';

/**
 * Internal function signature for getting parent paths.
 *
 * @param value - Target state path string.
 *
 * @returns Array of parent path strings.
 */
type _GetParents_F = (value: string) => string[];

/**
 * Function signature for retrieving all parent ancestor path strings for a state path.
 *
 * @param value - Root-relative path string.
 *
 * @returns Array of parent path strings.
 */
type GetParents_F = (value: `/${string}`) => string[];

/**
 * Internal recursive helper to retrieve all parent ancestor path strings for a path.
 *
 * @param value - Target state path string.
 *
 * @returns Array of parent path strings.
 */
const _getParents: _GetParents_F = value => {
  const last = value.lastIndexOf(DEFAULT_DELIMITER);
  const out = new Set('/');
  out.add(value);
  const str2 = value.substring(0, last);
  if (isStringEmpty(str2)) {
    return Array.from(out);
  }

  const inner = _getParents(str2);
  inner.forEach(v => out.add(v));

  return Array.from(out);
};

/**
 * Returns an array of parent paths for the given path.
 * @param value - The path to get parents for.
 * @returns An array of parent paths.
 *
 * @see -- type {@linkcode GetParents_F}, {@linkcode _getParents}
 */
export const getParents: GetParents_F = _getParents;
