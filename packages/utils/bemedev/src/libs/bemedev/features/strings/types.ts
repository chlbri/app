import type { AnyArray } from '../../globals/types';
import type { ENGLISH_LETTERS } from './constants';

/**
 * PossibleString type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type PossibleString =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined;

/**
 * ArrayS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type ArrayS = AnyArray<PossibleString>;

/**
 * LowerLetters type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type LowerLetters = (typeof ENGLISH_LETTERS)[number];
/**
 * UpperLetters type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type UpperLetters = Uppercase<LowerLetters>;
/**
 * Letters type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Letters = UpperLetters | LowerLetters;
/**
 * Email type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type Email = `${string}@${string}.${string}`;

/**
 * JoinString type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type JoinString<
  T extends ArrayS,
  sep extends PossibleString = ' ',
> = T extends []
  ? ''
  : T extends [PossibleString]
    ? `${T[0]}`
    : T extends [PossibleString, ...infer U extends ArrayS]
      ? `${T[0]}${sep}${JoinString<U, sep>}`
      : string;

/**
 * AddString type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type AddString<
  T,
  Before extends string = '',
  After extends string = '',
> = `${Before}${T & string}${After}`;

/**
 * StringEndWith type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type StringEndWith<
  S extends string,
  E extends string,
> = S extends `${infer Prev}${E}`
  ? { response: true; full: S; prev: Prev }
  : { response: false; full: S; prev: S };

/**
 * StringStartWith type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type StringStartWith<
  S extends string,
  E extends string,
> = S extends `${E}${infer Next}`
  ? { response: true; full: S; next: Next }
  : { response: false; full: S; next: S };

/**
 * StringContains type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type StringContains<
  S extends string,
  E extends string,
> = S extends `${infer Prev}${E}${infer Next}`
  ? { response: true; full: S; prev: Prev; next: Next }
  : { response: false; full: S; prev: string; next: string };

/**
 * Credit to {@link https://stackoverflow.com/a/70831818/11704485 | Matthieu Riegler}
 */
/**
 * SplitStringBy type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type SplitStringBy<
  S extends string,
  By extends string = '.',
> = string extends S
  ? string[]
  : S extends ''
    ? []
    : S extends `${infer T}${By}${infer U}`
      ? [T, ...SplitStringBy<U, By>]
      : [S];

/**
 * ExtractS type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type ExtractS<T> = Extract<T, string>;

/**
 * StringLength type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type StringLength<
  T extends string,
  Counter extends number[] = [],
> = T extends `${string}${infer Tail}`
  ? StringLength<Tail, [...Counter, 0]>
  : Counter['length'];

/**
 * StringCompare type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type StringCompare<
  First extends number,
  Second extends number,
  Counter extends number[] = [],
> = First extends Second
  ? 0
  : Counter['length'] extends First
    ? -1
    : Counter['length'] extends Second
      ? 1
      : StringCompare<First, Second, [...Counter, 0]>;

/**
 * StringCompareWith type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type StringCompareWith<
  First extends string,
  Second extends string,
> = StringCompare<StringLength<First>, StringLength<Second>>;

/**
 * ExactLength type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type ExactLength<Exact extends number, T extends string> =
  StringCompare<StringLength<T>, Exact> extends 0 ? T : never;

/**
 * MaxLength type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type MaxLength<Max extends number, T extends string> =
  StringCompare<StringLength<T>, Max> extends -1 ? T : never;

/**
 * MaxOrEqualLength type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type MaxOrEqualLength<Max extends number, T extends string> =
  | MaxLength<Max, T>
  | ExactLength<Max, T>;

/**
 * MinLength type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type MinLength<Min extends number, T extends string> =
  StringCompare<StringLength<T>, Min> extends 1 ? T : never;

/**
 * MinOrEqualLength type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type MinOrEqualLength<Min extends number, T extends string> =
  | MinLength<Min, T>
  | ExactLength<Min, T>;

/**
 * InRangeExclusive type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type InRangeExclusive<
  Min extends number,
  Max extends number,
  T extends string,
> = MinLength<Min, T> & MaxLength<Max, T>;

/**
 * InRangeInclusive type - Auto-generated expression
 *
 * ⚠️ WARNING: This expression is auto-generated and should not be modified.
 * Any manual changes will be overwritten during the next generation.
 *
 * @generated
 * @readonly
 * @author chlbri (bri_lvi@icloud.com)
 */
export type InRangeInclusive<
  Min extends number,
  Max extends number,
  T extends string,
> = MinOrEqualLength<Min, T> & MaxOrEqualLength<Max, T>;
