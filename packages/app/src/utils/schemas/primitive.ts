import * as v from 'valibot';

export const PrimitiveSchema = v.union([
  v.string(),
  v.number(),
  v.boolean(),
  v.undefined(),
]);
