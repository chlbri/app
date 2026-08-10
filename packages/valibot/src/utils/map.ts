import * as v from 'valibot';

/**
 * Valibot schema union for valid map keys (string, number, or symbol).
 */
export const KeysSchema = v.union([v.string(), v.number(), v.symbol()]);

/**
 * Custom Valibot schema builder for validating object key-value maps against a value schema.
 *
 * @template {v.BaseSchema<any, any, any>} TSchema - Valibot schema type for map values.
 *
 * @param schema - Valibot schema to validate each map value against.
 *
 * @returns Custom Valibot schema validating object record maps.
 *
 * @see {@linkcode KeysSchema}
 */
export const MapSchema = <
  const TSchema extends v.BaseSchema<any, any, any>,
>(
  schema: TSchema,
): v.BaseSchema<
  Record<keyof any, v.InferInput<TSchema>>,
  Record<keyof any, v.InferOutput<TSchema>>,
  v.BaseIssue<unknown>
> =>
  v.custom((value: unknown) => {
    if (
      typeof value !== 'object' ||
      value === null ||
      Array.isArray(value)
    ) {
      return false;
    }
    const entries = Object.entries(value);
    const check1 = entries.every(
      ([key, value]) =>
        v.safeParse(KeysSchema, key).success &&
        v.safeParse(schema, value).success,
    );

    return check1;
  });
