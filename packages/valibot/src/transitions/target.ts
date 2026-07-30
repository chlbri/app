import * as v from 'valibot';

export type TransformLiterals<T extends ReadonlyArray<string>> =
  T extends [
    infer Head extends string,
    ...infer Tail extends ReadonlyArray<string>,
  ]
    ? [v.LiteralSchema<Head, any>, ...TransformLiterals<Tail>]
    : [];

export type Output<T extends ReadonlyArray<string>> = T extends []
  ? v.StringSchema<any>
  : v.UnionSchema<TransformLiterals<T>, any>;

export const TargetSchema = <T extends ReadonlyArray<string>>(
  paths: T,
): Output<T> => {
  const isEmpty = paths.length === 0;
  const out = isEmpty ? v.string() : v.union(paths.map(p => v.literal(p)));
  return out as any;
};
