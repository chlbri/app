import * as v from 'valibot';

type Literal = v.LiteralSchema<string | number | boolean, any>;

type RL = ReadonlyArray<Literal>;

export type ExtractLiteralsOutput<T extends RL> = T extends [
  infer L extends Literal,
  ...infer Rest extends RL,
]
  ? [L['literal'], ...ExtractLiteralsOutput<Rest>]
  : [];

export const extractLiterals = <const TSchema extends RL>(
  schema: v.UnionSchema<TSchema, any>,
): ExtractLiteralsOutput<TSchema> => {
  return schema.options.map(o => o.literal) as any;
};
