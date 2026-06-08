import * as v from 'valibot';
import { NotArray_Schema } from './array';

export const recordV = <
  const TKey extends v.BaseSchema<
    string,
    string | number | symbol,
    v.BaseIssue<unknown>
  >,
  const TValue extends v.BaseSchema<
    unknown,
    unknown,
    v.BaseIssue<unknown>
  >,
  const TMessage extends v.ErrorMessage<v.RecordIssue> | undefined =
    undefined,
>(
  key: TKey,
  value: TValue,
  message?: TMessage,
) => {
  return v.pipe(v.any(), NotArray_Schema, v.record(key, value, message));
};
