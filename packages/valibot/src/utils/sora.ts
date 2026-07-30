import type { SoRa } from '@bemedev/app/bemedev';
import * as v from 'valibot';

export function SoraSchema<
  const TSchema extends v.BaseSchema<any, any, any>,
>(
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
  > = v.lazy(() =>
    v.union([schema, v.array(v.lazy(() => baseSchema))]),
  ) as any;

  return baseSchema;
}
