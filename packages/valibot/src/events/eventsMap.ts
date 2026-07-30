import * as v from 'valibot';
import { PrimitiveObjectSchema } from '../utils/primitive.object';
import { recordV } from '../utils/record';

export const EventsMapSchema = recordV(v.string(), PrimitiveObjectSchema);
