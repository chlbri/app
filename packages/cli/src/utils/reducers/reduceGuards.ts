import { GUARD_TYPE } from '@bemedev/app';
import type { GuardUnion } from '@bemedev/app/types';

/**
 * Flattens and deduplicates guard configurations into a unique list of names.
 *
 * Guards are declared as plain strings. Logical `and` / `or` structures are
 * flattened recursively.
 *
 * @param guards - Array of guard unions of type {@linkcode GuardUnion}.
 *
 * @returns Array of deduplicated guard names.
 */
export const reduceGuards = (...guards: GuardUnion[]): string[] => {
  const result = new Set<string>();

  const add = (guard: GuardUnion): void => {
    if (typeof guard === 'string') {
      result.add(guard);
      return;
    }

    if (GUARD_TYPE.and in guard) {
      guard.and.forEach(add);
      return;
    }

    if (GUARD_TYPE.or in guard) guard.or.forEach(add);
  };

  guards.forEach(add);

  return [...result];
};
