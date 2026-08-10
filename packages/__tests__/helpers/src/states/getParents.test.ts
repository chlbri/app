import { getParents } from '@bemedev/app/states';

describe('getParents', () => {
  describe('#01 => should return correct parents for top level state', () => {
    const result = getParents('/state1');

    test('#01 => includes root', () =>
      expect(result).toContain('/'));
    test('#02 => equals expected array', () =>
      expect(result).toEqual(['/', '/state1']));
  });

  describe('#02 => should return correct parents for second level state', () => {
    const result = getParents('/state1/state2');
    // Parents include: root, the path itself, and intermediate paths

    test('#01 => result is correct', () =>
      expect(result).toStrictEqual([
        '/',
        '/state1/state2',
        '/state1',
      ]));
  });

  test('#03 => should return correct parents for deeply nested state', () =>
    expect(getParents('/state1/state2/state3/state4')).toEqual([
      '/',
      '/state1/state2/state3/state4',
      '/state1/state2/state3',
      '/state1/state2',
      '/state1',
    ]));

  test('#04 => should handle empty parts correctly', () =>
    expect(getParents('/state1//state3')).toEqual([
      '/',
      '/state1//state3',
      '/state1/',
      '/state1',
    ]));

  test('#05 => should handle path starting with delimiter correctly', () =>
    expect(getParents('/')).toEqual(['/']));

  test('#06 => should handle consecutive delimiters correctly', () =>
    expect(getParents('//state1')).toEqual(['/', '//state1']));

  test('#07 => should handle path ending with delimiter correctly', () =>
    expect(getParents('/state1/')).toEqual([
      '/',
      '/state1/',
      '/state1',
    ]));
});
