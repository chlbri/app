import * as v from 'valibot';

/**
 * Recursively maps a string array tuple type to a tuple of Valibot literal schemas.
 *
 * @template `T` - Array of string literals extending `ReadonlyArray<string>`.
 */
export type TransformLiterals<T extends ReadonlyArray<string>> = T extends [
  infer Head extends string,
  ...infer Tail extends ReadonlyArray<string>,
]
  ? [v.LiteralSchema<Head, any>, ...TransformLiterals<Tail>]
  : [];

/**
 * Determines the output Valibot schema type for target paths (string schema if empty, union schema otherwise).
 *
 * @template `T` - Array of target path strings extending `ReadonlyArray<string>`.
 *
 * @see {@linkcode TransformLiterals}
 */
export type Output<T extends ReadonlyArray<string>> = T extends []
  ? v.StringSchema<any>
  : v.UnionSchema<TransformLiterals<T>, any>;

/**
 * Creates a Valibot schema for state transition target validation.
 *
 * @template `T` - Array of target path string literals extending `ReadonlyArray<string>`.
 *
 * @param paths - Target path string literals array.
 *
 * @returns Valibot target schema of type {@linkcode Output}.
 *
 * @see type {@linkcode Output}
 */
export const TargetSchema = <T extends ReadonlyArray<string>>(
  paths: T,
): Output<T> => {
  const isEmpty = paths.length === 0;
  const out = isEmpty ? v.string() : v.union(paths.map(p => v.literal(p)));
  return out as any;
};
