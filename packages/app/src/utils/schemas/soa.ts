import type { SoA } from '@bemedev/app-utils-bemedev';
import * as v from 'valibot';
import type { SingleOrArrayL } from '~types';

export const SoaSchema = <
  T extends v.BaseSchema<any, any, v.BaseIssue<unknown>>,
>(
  schema: T,
): v.BaseSchema<
  SoA<v.InferOutput<T>>,
  SoA<v.InferOutput<T>>,
  v.BaseIssue<unknown>
> => {
  return v.union([v.array(schema), schema]);
};

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
