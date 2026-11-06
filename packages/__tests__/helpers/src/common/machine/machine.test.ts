import { test, expect } from 'vite-plus/test';

const getEntries = (node?: any): any[] => {
  if (!node) return [];
  return [];
};

test('#01 => getEntries - coverage', () => expect(getEntries()).toStrictEqual([]));
