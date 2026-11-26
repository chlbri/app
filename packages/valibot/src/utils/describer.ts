import * as v from 'valibot';

/**
 * Valibot schema for describer object containing a `name` string property.
 */
export const DescriberSchema = v.strictObject({ name: v.string() });
