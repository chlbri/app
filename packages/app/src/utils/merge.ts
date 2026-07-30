import type { DeepPartial } from '@bemedev/app-utils-bemedev';
import { deepmergeCustom } from 'deepmerge-ts';

export const _merge = deepmergeCustom({
  mergeArrays: false,
  mergeMaps: false,
  mergeRecords: (values, all, options) => {
    return all.defaultMergeFunctions.mergeRecords(
      values,
      all as any,
      options,
    );
  },
});

const UNEFINED_KEY = '##__FilterUndefined__';

class MergeUndefined {
  readonly [UNEFINED_KEY] = UNEFINED_KEY;
}

export const MERGE_UNDEFINED = new MergeUndefined();

// create a function that transform MERGE_UNDEFINED to undefined in all cases deep nested array or object, recursive

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
