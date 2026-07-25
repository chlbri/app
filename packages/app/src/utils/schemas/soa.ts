import * as v from 'valibot';
import type { SingleOrArrayL } from '~types';

export const SoaLSchema = <
  T extends v.BaseSchema<any, any, v.BaseIssue<unknown>>,
>(
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
