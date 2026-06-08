import { PrimitiveObjectSchema, recordV } from '#utils/schemas';
import * as v from 'valibot';

export const EventsMapSchema = recordV(v.string(), PrimitiveObjectSchema);
