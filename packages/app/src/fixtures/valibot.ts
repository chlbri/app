import { createTests } from '@bemedev/dev-utils/vitest-extended';
import * as v from 'valibot';

export const createValibotTests = <
  T extends v.BaseSchema<any, any, v.BaseIssue<unknown>>,
>(
  schema: T,
) => {
  const fn = (value: unknown) => v.safeParse(schema, value).success;
  const out = createTests(fn);

  return out;
};
