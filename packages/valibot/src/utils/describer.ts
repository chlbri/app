import * as v from 'valibot';

/**
 * Valibot schema for describer object containing `name` and `description` string properties.
 */
export const DescriberSchema = v.strictObject({
  name: v.string(),
  description: v.string(),
});
