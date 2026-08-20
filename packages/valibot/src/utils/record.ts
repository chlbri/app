import * as v from 'valibot';
import { NotArray_Schema } from './array';

/**
 * Helper function building a non-array Valibot record schema with given key, value, and optional error message.
 *
 * @template {v.BaseSchema<string, string | number | symbol, v.BaseIssue<unknown>>} TKey - Key schema type.
 * @template {v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>} TValue - Value schema type.
 * @template {v.ErrorMessage<v.RecordIssue> | undefined} TMessage - Optional error message type.
 *
 * @param key - Valibot key schema.
 * @param value - Valibot value schema.
 * @param message - Optional error message when validation fails.
 *
 * @returns Valibot schema validating record object.
 *
 * @see {@linkcode NotArray_Schema}
 */
export const recordV = <
  const TKey extends v.BaseSchema<
    string,
    string | number | symbol,
    v.BaseIssue<unknown>
  >,
  const TValue extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  const TMessage extends v.ErrorMessage<v.RecordIssue> | undefined = undefined,
>(
  key: TKey,
  value: TValue,
  message?: TMessage,
) => {
  return v.pipe(v.any(), NotArray_Schema, v.record(key, value, message));
};
