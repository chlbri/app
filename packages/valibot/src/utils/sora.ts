import type { SoRa } from '@bemedev/app/bemedev';
import * as v from 'valibot';

/**
 * Recursive Valibot schema builder for single elements or arbitrarily nested arrays of elements.
 *
 * @template {v.BaseSchema<any, any, any>} TSchema - Inner element schema type.
 *
 * @param schema - Base element schema to wrap recursively.
 *
 * @returns Valibot schema validating recursive single or nested array structures of type {@linkcode SoRa}.
 *
 * @see type {@linkcode SoRa}
 */
export function SoraSchema<const TSchema extends v.BaseSchema<any, any, any>>(
  schema: TSchema,
): v.BaseSchema<
  SoRa<v.InferInput<TSchema>>,
  SoRa<v.InferOutput<TSchema>>,
  v.BaseIssue<unknown>
> {
  const baseSchema: v.BaseSchema<
    SoRa<v.InferInput<TSchema>>,
    SoRa<v.InferOutput<TSchema>>,
    v.BaseIssue<unknown>
  > = v.lazy(() => v.union([schema, v.array(v.lazy(() => baseSchema))])) as any;

  return baseSchema;
}
