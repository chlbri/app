import * as v from 'valibot';
import { PrimitiveObjectSchema } from '../utils/primitive.object';

export const EventObjectSchema = v.object({
  type: v.string(),
  payload: PrimitiveObjectSchema,
});
