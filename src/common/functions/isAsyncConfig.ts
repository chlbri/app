import type { NodeConfig } from '~types';

/**
 * Runtime validation function to check if a value is an async config.
 * An async config has an 'after' property or contains states with 'after'.
 */
export function isAsyncConfig(value: unknown): value is NodeConfig {
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
