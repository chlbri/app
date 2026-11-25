import type { Fn } from '../../../../globals/types';

/**
 * is const - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
const is = (value: unknown): value is Fn => {
  return typeof value === 'function';
};

export default is;
