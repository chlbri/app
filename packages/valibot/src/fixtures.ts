import { createTests } from '@bemedev/dev-utils/vitest-extended';
import * as v from 'valibot';

/**
 * Helper function for creating Vitest test suits for a given Valibot schema.
 *
 * @template {v.BaseSchema<any, any, v.BaseIssue<unknown>>} T - Valibot schema type.
 * @param schema - The Valibot schema instance to validate against.
 * @returns Test runner helper object created via `createTests`.
 */
export const createValibotTests = <
  T extends v.BaseSchema<any, any, v.BaseIssue<unknown>>,
>(
  schema: T,
) => {
  const fn = (value: unknown) => v.safeParse(schema, value).success;
  const out = createTests(fn);

  return out;
};
