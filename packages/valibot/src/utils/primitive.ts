import * as v from 'valibot';

/**
 * Valibot schema union for primitive JS values (string, number, boolean, or undefined).
 */
export const PrimitiveSchema = v.union([
  v.string(),
  v.number(),
  v.boolean(),
  v.undefined(),
]);
