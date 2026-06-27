import {
  GUARD_TYPE,
  fromDescriber,
  type GuardUnion,
  type WithDescriber,
} from '@bemedev/app';

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
      } else {
        // New key - add it
        keyMap.set(key, result.length);
        result.push(item);
      }
    });

  return result;
};
