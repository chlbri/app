import { swap } from './swap';

describe('#01 => swap', () => {
  test('#01 => remaps arguments from decomposed paths', () => {
    const fn = swap((value: number) => value + 1)({ '[0]': '[0].context' });

    expect(fn({ context: 1, pContext: {} } as any)).toBe(2);
  });
});
