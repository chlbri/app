import type { Checker2 } from '../../../../globals/types';
import is from '../is';

/**
 * fn const - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
const fn = <const T>(fn: Checker2<T>) => {
  const _out = (value: unknown): value is Array<T> => {
    return is(value) && value.every(fn);
  };

  return _out;
};

export default fn;
