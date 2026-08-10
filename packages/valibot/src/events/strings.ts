import * as v from 'valibot';

/**
 * Valibot schema union for system-level reserved event string literals.
 */
export const EventsStringsSchema = v.union([
  v.literal('machine$$init'),
  v.literal('machine$$always'),
  v.literal('machine$$after'),
  v.literal('machine$$exceeded'),
]);
