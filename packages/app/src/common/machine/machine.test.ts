import { getEntries } from './machine';

describe('Coverage tests', () => {
  test('#01 => getEntries - coverage', () => {
    expect(getEntries()).toStrictEqual([]);
  });
});
