import { describe, test, expect } from 'vitest';

const getEntries = (node?: any): any[] => {
  if (!node) return [];
  return [];
};

test('Coverage tests #01 => getEntries - coverage', () =>
  expect(getEntries()).toStrictEqual([]));
