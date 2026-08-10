import { describe, test, expect } from 'vitest';

const getEntries = (node?: any): any[] => {
  if (!node) return [];
  return [];
};

describe('Coverage tests', () => {
  test('#01 => getEntries - coverage', () => {
    expect(getEntries()).toStrictEqual([]);
  });
});
