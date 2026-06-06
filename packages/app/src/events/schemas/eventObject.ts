import { PrimitiveObjectSchema } from '#utils/schemas';
import * as v from 'valibot';

export const EventObjectSchema = v.object({
  type: v.string(),
  payload: PrimitiveObjectSchema,
});
