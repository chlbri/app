import * as v from 'valibot';
import { EventObjectSchema } from './eventObject';
import { EventsStringsSchema } from './strings';

/**
 * Valibot schema union for all machine events (event object or reserved string event).
 *
 * @see {@linkcode EventObjectSchema}, {@linkcode EventsStringsSchema}
 */
export const AllEventsSchema = v.union([EventObjectSchema, EventsStringsSchema]);
