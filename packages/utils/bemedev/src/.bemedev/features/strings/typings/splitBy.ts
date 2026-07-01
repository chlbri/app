import type { SplitStringBy } from '../../../globals/types';
import { _unknown } from '../../../globals/utils/_unknown';

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
const fn = <const S extends string, By extends string = '.'>(
  _?: S,
  __?: By,
) => _unknown<SplitStringBy<S, By>>();

export default fn;
