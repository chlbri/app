import * as v from 'valibot';

/**
 * Valibot check action to ensure value is not an array.
 */
export const NotArray_Schema = v.check(
  a => !Array.isArray(a),
  'Not an array',
);
