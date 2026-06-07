import { PrimitiveObjectSchema } from '#utils/schemas';
import * as v from 'valibot';

export const EventsMapSchema = v.record(v.string(), PrimitiveObjectSchema);
