import * as v from 'valibot';

export const extractLiterals = <
  const TSchema extends ReadonlyArray<
    v.LiteralSchema<string | number | boolean, any>
  >,
>(
  schema: v.UnionSchema<TSchema, any>,
): TSchema[number]['literal'][] => {
  return schema.options.map(o => o.literal);
};
