import * as v from 'valibot';

/**
 * Type alias for Valibot literal schema of string, number, or boolean values.
 */
type Literal = v.LiteralSchema<string | number | boolean, any>;

/**
 * Type alias for a read-only array of literal schemas.
 *
 * @see type {@linkcode Literal}
 */
type RL = ReadonlyArray<Literal>;

/**
 * Maps a tuple of literal schemas to a tuple of their underlying literal values.
 *
 * @template | {@linkcode RL} `T` - Array of Valibot literal schemas.
 *
 * @see -- type {@linkcode RL}, -- type {@linkcode Literal}
 */
export type ExtractLiteralsOutput<T extends RL> = T extends [
  infer L extends Literal,
  ...infer Rest extends RL,
]
  ? [L['literal'], ...ExtractLiteralsOutput<Rest>]
  : [];

/**
 * Extracts literal values from a Valibot union schema of literal options.
 *
 * @template | {@linkcode RL} `TSchema` - Readonly tuple of literal schemas.
 *
 * @param schema - Union schema containing literal schema options.
 *
 * @returns Array of extracted literal values of type {@linkcode ExtractLiteralsOutput}.
 *
 * @see -- type {@linkcode ExtractLiteralsOutput}, -- type {@linkcode RL}
 */
export const extractLiterals = <const TSchema extends RL>(
  schema: v.UnionSchema<TSchema, any>,
): ExtractLiteralsOutput<TSchema> => {
  return schema.options.map(o => o.literal) as any;
};
