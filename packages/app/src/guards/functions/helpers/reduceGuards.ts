import { GUARD_TYPE } from '#constants';
import type { WithDescriber } from '#actions';
import type { GuardUnion } from '../../types';
import { fromDescriber } from '~types';

/**
 * Reduces one or more guard unions into a flat array of action configurations.
 *
 * Recursively flattens nested guard structures (AND/OR) into a single array
 * of action configurations, preserving all leaf-level actions with deduplication.
 *
 * Rules:
 * 1. No repeated keys - duplicate keys are skipped
 * 2. When a key exists as a string, replace it with WithDescriber if encountered
 *
 * @param guards - One or more guard unions to reduce
 * @returns A flat array of action configurations without duplicates
 *
 * @see {@linkcode GuardUnion}
 * @see {@linkcode WithDescriber}
 * @see {@linkcode GUARD_TYPE}
 */
export const reduceGuards = (...guards: GuardUnion[]): WithDescriber[] => {
  const result: WithDescriber[] = [];
  const keyMap = new Map<string, number>();

  guards
    .flatMap(guard => {
      if (typeof guard === 'string') return [guard];
      if (GUARD_TYPE.and in guard) return reduceGuards(...guard.and);
      if (GUARD_TYPE.or in guard) return reduceGuards(...guard.or);
      return [guard];
    })
    .forEach(item => {
      const key = fromDescriber(item);

      if (keyMap.has(key)) {
        // Key exists - check if we should replace
        if (typeof item !== 'string') {
          // New item is a WithDescriber, replace the string if exists
          const index = keyMap.get(key)!;
          if (typeof result[index] === 'string') result[index] = item;
        }
        // If new item is a string and key exists, skip (rule 1)
      } else {
        // New key - add it
        keyMap.set(key, result.length);
        result.push(item);
      }
    });

  return result;
};
