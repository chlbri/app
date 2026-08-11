import { validate } from '@bemedev/app-valibot';
import delayNotDefined from '#machines/helpers/delays/delay.notDefined.machine';
import { machine1 as delayMachine1 } from '#machines/helpers/delays/fixtures';

describe('Delays machines validation', () => {
  test('#01 => delay.notDefined.machine', () =>
    expect(validate.safe(delayNotDefined.config).success).toBe(true));

  test('#02 => delays fixtures machine1', () =>
    expect(validate.safe(delayMachine1.config).success).toBe(true));
});
