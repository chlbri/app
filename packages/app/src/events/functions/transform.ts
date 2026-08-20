import type { EventObject } from '../types';

/**
 * Function type signature for transforming a raw event argument into an interface {@linkcode EventObject}.
 *
 * @template `T` - Target event object type extending interface {@linkcode EventObject}.
 * @param event - Raw string event or event object.
 *
 * @returns The transformed event object of type `T`.
 */
export type TransformEventArg = <T extends EventObject = EventObject>(
  event: string | EventObject,
) => T;

/**
 * Transforms a raw event argument into a standardized interface {@linkcode EventObject}.
 *
 * @param event - The event string or event object to transform.
 *
 * @returns Standardized event object containing `type` and `payload`.
 *
 * @see {@linkcode TransformEventArg}
 */
export const transformEventArg: TransformEventArg = event => {
  const check1 = typeof event === 'string';
  if (check1) return { type: event, payload: {} } as any;

  return { ...event, payload: event.payload };
};
