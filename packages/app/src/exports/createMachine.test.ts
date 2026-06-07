import { ERROR } from './constants';
import { createMachine } from './createMachine';

test.skip('#00 => COVERAGE TESTS', () => {
  const fn = createMachine as any;
  const config = {
    on: {},
    unknownKey: 'value',
  };
  expect(() => fn(config)).toThrow(ERROR);
});
