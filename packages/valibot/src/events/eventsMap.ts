import * as v from 'valibot';
import { PrimitiveObjectSchema } from '../utils/primitive.object';
import { recordV } from '../utils/record';

/**
 * Valibot schema for a map of machine events to primitive payload objects.
 *
 * @see {@linkcode recordV}, {@linkcode PrimitiveObjectSchema}
 */
export const EventsMapSchema = recordV(v.string(), PrimitiveObjectSchema);
