import { Config_Schema } from './schema';
import * as v from 'valibot';

describe('Coverage', () => {
  test('#01 => Error => Unexpected key. at root level', () => {
    const actual = () => v.parse(Config_Schema(), { dd: true });
    expect(actual).toThrow(`Unexpected key 'dd' in node config`);
  });

  test('#02 => Error => Unexpected key. at states level', () => {
    const actual = () =>
      v.parse(Config_Schema(), {
        initial: 'idle',
        states: { idle: { dd: true } },
      });
    expect(actual).toThrow(`Unexpected key 'dd' in node config`);
  });

  test('#03 => Error => wrong activity array', () => {
    const actual = () =>
      v.parse(Config_Schema(), {
        activities: { DELAY: ['dd', 'ee'] },
      });
    expect(actual).toThrow('Wrong activity Array');
  });

  test('#04 => Error => empty activity array', () => {
    const actual = () =>
      v.parse(Config_Schema(), { activities: { DELAY: [] } });
    expect(actual).toThrow('Empty Activity Array');
  });

  test('#04 => Error => activities not accepts type "Array"', () => {
    const actual = () =>
      v.parse(Config_Schema(), {
        activities: [],
      });
    expect(actual).toThrow('Not an array');
  });
});
