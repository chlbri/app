import type { DeepPartial } from '@bemedev/app-utils-bemedev';
import { deepmergeCustom } from 'deepmerge-ts';

/**
 * Custom deep merge instance configured with `deepmerge-ts` ({@linkcode deepmergeCustom}).
 */
export const _merge = deepmergeCustom({
  mergeArrays: false,
  mergeMaps: false,
  mergeRecords: (values, all, options) => {
    return all.defaultMergeFunctions.mergeRecords(values, all as any, options);
  },
});

/** Sentinel key for filtering undefined values during object merging. */
const UNEFINED_KEY = '##__FilterUndefined__';

/**
 * Class representing a sentinel object for merging undefined values.
 */
class MergeUndefined {
  /**
   * Sentinel property key identifier.
   */
  readonly [UNEFINED_KEY] = UNEFINED_KEY;
}

/**
 * Sentinel constant instance of class {@linkcode MergeUndefined}.
 */
export const MERGE_UNDEFINED = new MergeUndefined();

/**
 * Recursively converts sentinel class {@linkcode MergeUndefined} markers into `undefined`.
 *
 * @param value - Target value or nested structure.
 *
 * @returns Deeply transformed object or array with `undefined` values.
 */
export const transformMergeUndefined = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(transformMergeUndefined);
  }

  if (typeof value === 'object' && value !== null) {
    const check1 = value[UNEFINED_KEY] === UNEFINED_KEY;
    if (check1) return undefined;

    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        transformMergeUndefined(value),
      ]),
    );
  }

  return value;
};

/**
 * Checks if a value is an instance of sentinel marker class {@linkcode MergeUndefined}.
 *
 * @param value - Value to check.
 *
 * @returns `true` if sentinel marker, `false` otherwise.
 */
export const isMergeUndefined = (value: any) => {
  const check1 = value[UNEFINED_KEY] === UNEFINED_KEY;
  return check1;
};

/**
 * A custom implement of `deepmerge-ts` ({@linkcode deepmergeCustom}) for better suitability with this library.
 * @param value The value to merge into.
 * @param mergers The values to merge with the original value
 * @returns The merged value, which is a new object containing the properties of the original value and the mergers.
 *
 * @see {@linkcode equal} for deep equality check
 * @see {@linkcode types} for partial type definition
 * @see {@linkcode NoInfer} for type inference utility
 */
export const merge = <T = any>(
  value: T,
  ...mergers: DeepPartial<NoInfer<T> | undefined>[]
): T => {
  // #region Check performance

  // #endregion

  const out = transformMergeUndefined(_merge(value, ...mergers));

  return out;
};
