import machine from './index.machine';

describe('COVERAGE => getters', () => {
  test.each(['__actionFn', '__predicate', '__delay'] as const)(
    '#0%$ should have %s getters',
    getter => {
      expect(machine[getter]).toBeUndefined();
    },
  );
});
