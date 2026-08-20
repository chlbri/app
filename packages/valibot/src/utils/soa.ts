import type { SingleOrArrayL } from '@bemedev/app/types';
import * as v from 'valibot';

/**
 * Valibot schema builder for a single element or a non-empty array of elements.
 *
 * @template {v.BaseSchema<any, any, v.BaseIssue<unknown>>} T - Inner element schema type.
 *
 * @param schema - Element schema to wrap.
 *
 * @returns Valibot schema validating a single value or non-empty array of type {@linkcode SingleOrArrayL}.
 *
 * @see type {@linkcode SingleOrArrayL}
 */
export const SoaLSchema = <T extends v.BaseSchema<any, any, v.BaseIssue<unknown>>>(
  schema: T,
): v.BaseSchema<
  SingleOrArrayL<v.InferOutput<T>>,
  SingleOrArrayL<v.InferOutput<T>>,
  v.BaseIssue<unknown>
> => {
  return v.union([
    v.pipe(
      v.array(schema),
      v.check(a => a.length > 0),
    ),
    schema,
  ]);
};
