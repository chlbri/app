import * as v from 'valibot';
import { PrimitiveObjectSchema } from '../utils/primitive.object';

/**
 * Valibot schema for structured machine event objects containing type and payload.
 *
 * @see {@linkcode PrimitiveObjectSchema}
 */
export const EventObjectSchema = v.object({
  type: v.string(),
  payload: PrimitiveObjectSchema,
});
