import type { TupleOf } from '../../../../globals/types';
import { _unknown } from '../../../../globals/utils/_unknown';

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
const fn = <const T, N extends number>(data: T, times: N) => {
  const out = Array.from({ length: times }, () => data);
  return _unknown<TupleOf<T, N>>(out);
};

export default fn;
