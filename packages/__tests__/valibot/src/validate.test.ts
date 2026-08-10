import { validate } from '@bemedev/app-valibot';

describe('Coverage', () => {
  test('#00 => traffic light config is valid', () => {
    const config = {
      initial: 'red',
      states: {
        red: { tags: ['stop_light'], on: { NEXT: '/green' } },
        yellow: { tags: ['caution_light'], on: { NEXT: '/red' } },
        green: {
          tags: ['go_light'],
          initial: 'normal',
          states: {
            normal: {
              tags: ['normal_speed'],
              on: { ACCELERATE: '/green/fast' },
            },
            fast: {
              tags: ['fast_speed'],
              on: { SLOW_DOWN: '/green/normal' },
            },
          },
          on: { NEXT: '/yellow' },
        },
      },
    } as const;

    expect(validate.safe(config).success).toBe(true);
  });

  test('#01 => Error => Unexpected key at root level', () => {
    expect(() => validate({ dd: true })).toThrow(
      `Unexpected key 'dd' in node config`,
    );
  });

  test('#02 => Error => Unexpected key at states level', () => {
    expect(() =>
      validate({ initial: 'idle', states: { idle: { dd: true } } }),
    ).toThrow(`Unexpected key 'dd' in node config`);
  });

  test('#03 => Error => wrong activity array', () => {
    expect(() =>
      validate({ activities: { DELAY: ['dd', 'ee'] } }),
    ).toThrow('Wrong activity Array');
  });

  test('#04 => Error => empty activity array', () => {
    expect(() => validate({ activities: { DELAY: [] } })).toThrow(
      'Empty Activity Array',
    );
  });

  test('#05 => Error => activities not accepts type "Array"', () => {
    expect(() => validate({ activities: [] })).toThrow('Not an array');
  });
});

