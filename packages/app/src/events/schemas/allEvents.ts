import * as v from 'valibot';
import { EventObjectSchema } from './eventObject';
import { EventsStringsSchema } from './strings';

export const AllEventsSchema = v.union([
  EventObjectSchema,
  EventsStringsSchema,
]);
