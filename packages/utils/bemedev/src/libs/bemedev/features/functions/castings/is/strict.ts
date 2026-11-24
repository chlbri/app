import type { Fn } from '../../../../globals/types';

/**
 * strict const - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
const strict = <T extends any[] = any[], R = any>(
  fn: (value: Fn<T, R>) => boolean,
) => {
  return (value: unknown): value is Fn<T, R> =>
    typeof value === 'function' && fn(value as Fn<T, R>);
};

export default strict;
