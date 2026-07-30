import * as v from 'valibot';

export const NotArray_Schema = v.check(
  a => !Array.isArray(a),
  'Not an array',
);
