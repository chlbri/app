import { isFnPromise } from '#utils';
import type { Fn, NodeConfig } from '~types';

/**
 * Runtime validation function to check if a value is an async config.
 * An async config has an 'after' property or contains states with 'after'.
 */
export function isAsyncConfig(value: unknown): value is NodeConfig {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;

  // Check if has direct 'after' property
  if ('after' in obj) {
    return true;
  }

  // Check if has 'states' property with nested configs
  if ('states' in obj && obj.states && typeof obj.states === 'object') {
    const states = obj.states as Record<string, unknown>;
    for (const state of Object.values(states)) {
      if (isAsyncConfig(state)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Runtime validation function to check if a value is an async function map.
 * An async function map contains functions that return Promises.
 */
export function isAsyncFnMap(value: unknown): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;
  const functions = Object.values(obj).filter(
    (v): v is Fn => typeof v === 'function',
  );

  // Must have at least one function
  if (functions.length === 0) {
    return false;
  }

  // Check if any function returns a Promise
  for (const fn of functions) {
    const check = isFnPromise(fn);
    if (check) return true;
  }

  return false;
}
