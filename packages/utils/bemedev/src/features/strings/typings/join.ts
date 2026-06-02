import type { JoinString } from '../../../globals/types';
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
const fn = <T extends readonly string[], sep extends string = ' '>(
  _?: sep,
  ...__: T
) => _unknown<JoinString<T, sep>>();

export default fn;
