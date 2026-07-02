import type { AnyArray } from '../../globals/types';
import type { UndefinedHelper } from '../common/types';

/**
 * Fn type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Fn<Args extends any[] = any[], R = any> = (...args: Args) => R;

/**
 * FnBasic type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type FnBasic<Main extends Fn, Tr extends object> = Tr & Main;
/**
 * _Requirify type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type _Requirify<T extends AnyArray> = Required<{
  [K in keyof T]-?: undefined extends T[K] ? T[K] | UndefinedHelper : T[K];
}>;

type _UndefinfyTuple<T extends AnyArray> = T extends readonly [
  infer U,
  ...infer Rest,
]
  ? unknown extends U
    ? [U, ..._UndefinfyTuple<Rest>]
    : UndefinedHelper extends U
      ? [Exclude<U, UndefinedHelper>?, ..._UndefinfyTuple<Rest>]
      : [U, ..._UndefinfyTuple<Rest>]
  : T;

/**
 * Parts type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Parts<
  T extends AnyArray,
  R = _Requirify<T>,
> = R extends readonly [...infer Rest, unknown]
  ? Parts<Rest> | Readonly<_UndefinfyTuple<R>>
  : Readonly<T>;

/**
 * Given a full readonly tuple `T1` and one of its prefixes `T2`,
 * produces the remaining ordered suffix.
 *
 * @example
 * PartDiff<readonly [1, 2, 3], readonly [1]>
 * // => readonly [2, 3]
 *
 * PartDiff<readonly [1, 2, 3], readonly []>
 * // => readonly [1, 2, 3]
 *
 * PartDiff<[1, 2, 3], [1, 2, 3]>
 * // => readonly []
 */
/**
 * PartDiff type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type PartDiff<
  T1 extends AnyArray,
  T2 extends Parts<T1>,
> = T1 extends readonly [...T2, ...infer Rest] ? Readonly<Rest> : T1;
