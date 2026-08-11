import type { EventObject } from '../types';

/**
 * Function type signature for extracting the event type string from an event or event object.
 *
 * @param event - The input event string or interface {@linkcode EventObject}.
 *
 * @returns The string type identifier of the event.
 */
export type EventToType_F = (event: EventObject | string) => string;

/**
 * Converts an event to its string type.
 *
 * @param event - The event string or interface {@linkcode EventObject}.
 *
 * @returns String representing the type of the event.
 *
 * @see type {@linkcode EventToType_F}
 */
export const eventToType: EventToType_F = event => {
  const check = typeof event === 'string';
  if (check) return event;
  return event.type;
};
