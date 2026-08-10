import { DEFAULT_NOTHING } from '@bemedev/app/constants';
import { nothing } from '@bemedev/app/utils';

describe('TESTS', () => {
  test('#00 => NODE_ENV is "test"', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  test('#01 => nothing is DEFAULT_NOTHING', () => {
    expect(nothing()).toStrictEqual(DEFAULT_NOTHING);
  });

  test('#02 => Change NODE_ENV to "mytest"', () => {
    vi.stubEnv('NODE_ENV', 'mytest');
  });

  test('#03 => NODE_ENV is "mytest"', () => {
    expect(process.env.NODE_ENV).toBe('mytest');
  });

  test('#04 => nothing is DEFAULT_NOTHING', () => {
    expect(nothing()).toBeUndefined();
  });
});
