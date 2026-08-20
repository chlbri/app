import type { SoA } from '../../../globals/types';
import { expandFn } from '../../../globals/utils/expandFn';

/**
 * Function interface for converting single items or arrays to standard arrays.
 */
type ToArray_F = {
  <T>(obj?: SoA<unknown>): T[];
  typed: <T>(obj: SoA<T>) => Exclude<T, undefined>[];
};

/**
 * Internal implementation to convert a single value or array into an array.
 *
 * @param value - Value or array to convert.
 *
 * @returns Array representation of input value.
 */
const _toArray = (value?: unknown) => {
  if (!value) return [];
  const checkArray = Array.isArray(value);
  const out = checkArray ? value : [value];

  return out;
};

/**
 * toArray const - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
const toArray: ToArray_F = expandFn(_toArray, { typed: _toArray });

export default toArray;
