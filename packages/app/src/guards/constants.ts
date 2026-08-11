/**
 * Helper function returning `true`.
 *
 * @returns Constant boolean `true`.
 */
export const returnTrue = () => {
  return true;
};

/**
 * Helper function returning `false`.
 *
 * @returns Constant boolean `false`.
 */
export const returnFalse = () => {
  return false;
};

/**
 * Default strict equality comparison comparator function.
 *
 * @template T - Value type.
 * @param a - First value.
 * @param b - Second value.
 *
 * @returns `true` if `a === b`, `false` otherwise.
 */
export const defaultCheck = <T>(a: T, b: T) => a === b;
