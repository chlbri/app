import * as v from 'valibot';

export const EventsStringsSchema = v.union([
  v.literal('machine$$init'),
  v.literal('machine$$always'),
  v.literal('machine$$after'),
  v.literal('machine$$exceeded'),
]);
