import { validate } from './validate';

describe('Coverage', () => {
  test('#00', () => {
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

    const actual = validate.safe(config);
    expect(actual.success).toBe(true);
  });
  test('#01 => Error => Unexpected key. at root level', () => {
    const actual = () => validate({ dd: true });
    expect(actual).toThrow(`Unexpected key 'dd' in node config`);
  });

  test('#02 => Error => Unexpected key. at states level', () => {
    const actual = () =>
      validate({ initial: 'idle', states: { idle: { dd: true } } });
    expect(actual).toThrow(`Unexpected key 'dd' in node config`);
  });

  test('#03 => Error => wrong activity array', () => {
    const actual = () => validate({ activities: { DELAY: ['dd', 'ee'] } });
    expect(actual).toThrow('Wrong activity Array');
  });

  test('#04 => Error => empty activity array', () => {
    const actual = () => validate({ activities: { DELAY: [] } });
    expect(actual).toThrow('Empty Activity Array');
  });

  test('#04 => Error => activities not accepts type "Array"', () => {
    const actual = () => validate({ activities: [] });
    expect(actual).toThrow('Not an array');
  });
});
