import type { Letters } from '../../../../globals/types';
import { typeFn } from '../../../../globals/utils/typeFn';
import lower from './lower';
import upper from './upper';

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
const fn = typeFn<Letters>()({
  lower,
  upper,
});

export default fn;
