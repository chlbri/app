/**
 * Event helpers used by the option runtime.
 *
 * Vendored from `@bemedev/app` so this package stays independent from the
 * machine implementation while producing the same `eventsList`.
 */

import { AFTER_EVENT, ALWAYS_EVENT, INIT_EVENT } from './constants';

/**
 * Type guard checking that an event is an internal event marker.
 *
 * @param event - Value to check.
 *
 * @returns `true` when `event` is an internal event string.
 */
export const isStringEvent = (event: any): event is string => {
  const out =
    typeof event === 'string' &&
    (event === INIT_EVENT ||
      event.endsWith(ALWAYS_EVENT) ||
      event.endsWith(AFTER_EVENT));

  return out;
};

/**
 * Transforms a raw event argument into a standardized event object.
 *
 * @param event - Event string or event object.
 *
 * @returns Event object holding `type` and `payload`.
 */
export const transformEventArg = (event: any) => {
  if (typeof event === 'string') return { type: event, payload: {} };
  return { ...event, payload: event.payload };
};

/** Allowed property keys for child actor configurations. */
const CHILD_KEYS = ['on', 'contexts', 'description'] as const;

/**
 * Type guard checking that a value looks like a child actor configuration.
 *
 * @param value - Value to check.
 *
 * @returns `true` when `value` is a child actor configuration.
 */
export const isChildConfig = (value: any): boolean => {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    return false;

  const keys = Object.keys(value);
  if (keys.length === 0) return false;
  if (!keys.every(key => CHILD_KEYS.includes(key as any))) return false;

  const { on, contexts, description } = value;

  if (description !== undefined && typeof description !== 'string') return false;
  if (on === undefined && contexts === undefined) return false;
  if (on !== undefined) {
    if (typeof on !== 'object' || on === null || Array.isArray(on)) return false;
  }

  if (contexts === undefined) return true;
  if (typeof contexts !== 'object' || contexts === null || Array.isArray(contexts))
    return false;

  return Object.values(contexts).every(item => typeof item === 'string');
};

/**
 * Collects every event string supported by a configuration and its descendants.
 *
 * @param node - State node configuration.
 *
 * @returns Array of event strings.
 */
export const constructEvents = (node: any): string[] => {
  const out: string[] = [];

  const on = node?.on;
  if (on) out.push(...Object.keys(on));

  const actors = node?.actors;
  if (actors) {
    for (const [key, actor] of Object.entries(actors)) {
      if (isChildConfig(actor)) {
        const on = (actor as any).on;
        if (on) Object.keys(on).forEach(k => out.push(`${key}::on::${k}`));
      } else {
        out.push(`${key}::next`);
        out.push(`${key}::error`);
      }
    }
  }

  const states = node?.states;
  if (states) {
    Object.values(states).forEach(state => out.push(...constructEvents(state)));
  }

  return out;
};
