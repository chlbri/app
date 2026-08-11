import { validate } from '@bemedev/app-valibot';
import helpersMachine_1 from '#machines/helpers/machine/addOptions-return.1.machine';
import helpersMachine_2 from '#machines/helpers/machine/addOptions-return.2.machine';
import helpersMachine_3 from '#machines/helpers/machine/addOptions-return.3.machine';
import helpersMachine_4 from '#machines/helpers/machine/addOptions-return.4.machine';
import helpersMachine_5 from '#machines/helpers/machine/cov.1.machine';
import helpersMachine_6 from '#machines/helpers/machine/cov.2.machine';
import helpersMachine_7 from '#machines/helpers/machine/cov.3.machine';
import helpersMachine_8 from '#machines/helpers/machine/longRuns.cov.1.machine';
import helpersMachine_9 from '#machines/helpers/machine/longRuns.cov.2.machine';
import helpersMachine_10 from '#machines/helpers/machine/longRuns.cov.3.machine';
import helpersMachine_11 from '#machines/helpers/machine/longRuns.cov.4.machine';
import helpersMachine_12 from '#machines/helpers/machine/longRuns.cov.5.machine';
import syncMachine_1 from '#machines/sync/machine/real.1.machine';
import syncMachine_2 from '#machines/sync/machine/real.2.machine';
import syncMachine_3 from '#machines/sync/machine/real.3.sync.machine';
import asyncMachine_1 from '#machines/async/machine/asyncActions.1.machine';
import asyncMachine_2 from '#machines/async/machine/asyncActions.2.machine';
import asyncMachine_3 from '#machines/async/machine/asyncActions.3.machine';
import asyncMachine_4 from '#machines/async/machine/asyncActions.4.machine';
import asyncMachine_5 from '#machines/async/machine/asyncActions.5.machine';
import asyncMachine_6 from '#machines/async/machine/asyncActions.6.machine';
import asyncMachine_7 from '#machines/async/machine/asyncActions.7.machine';
import asyncMachine_8 from '#machines/async/machine/real.1.machine';
import asyncMachine_9 from '#machines/async/machine/real.2.machine';
import asyncMachine_10 from '#machines/async/machine/real.3.machine';

describe('Machine package machines validation', () => {
  test('#01 => machine/addOptions-return.1.machine.ts', () =>
    expect(validate.safe(helpersMachine_1.config).success).toBe(true));

  test('#02 => machine/addOptions-return.2.machine.ts', () =>
    expect(validate.safe(helpersMachine_2.config).success).toBe(true));

  test('#03 => machine/addOptions-return.3.machine.ts', () =>
    expect(validate.safe(helpersMachine_3.config).success).toBe(true));

  test('#04 => machine/addOptions-return.4.machine.ts', () =>
    expect(validate.safe(helpersMachine_4.config).success).toBe(true));

  test('#05 => machine/cov.1.machine.ts', () =>
    expect(validate.safe(helpersMachine_5.config).success).toBe(true));

  test('#06 => machine/cov.2.machine.ts', () =>
    expect(validate.safe(helpersMachine_6.config).success).toBe(true));

  test('#07 => machine/cov.3.machine.ts', () =>
    expect(validate.safe(helpersMachine_7.config).success).toBe(true));

  test('#08 => machine/longRuns.cov.1.machine.ts', () =>
    expect(validate.safe(helpersMachine_8.config).success).toBe(true));

  test('#09 => machine/longRuns.cov.2.machine.ts', () =>
    expect(validate.safe(helpersMachine_9.config).success).toBe(true));

  test('#10 => machine/longRuns.cov.3.machine.ts', () =>
    expect(validate.safe(helpersMachine_10.config).success).toBe(true));

  test('#11 => machine/longRuns.cov.4.machine.ts', () =>
    expect(validate.safe(helpersMachine_11.config).success).toBe(true));

  test('#12 => machine/longRuns.cov.5.machine.ts', () =>
    expect(validate.safe(helpersMachine_12.config).success).toBe(true));

  test('#13 => machine/real.1.machine.ts', () =>
    expect(validate.safe(syncMachine_1.config).success).toBe(true));

  test('#14 => machine/real.2.machine.ts', () =>
    expect(validate.safe(syncMachine_2.config).success).toBe(true));

  test('#15 => machine/real.3.sync.machine.ts', () =>
    expect(validate.safe(syncMachine_3.config).success).toBe(true));

  test('#16 => machine/asyncActions.1.machine.ts', () =>
    expect(validate.safe(asyncMachine_1.config).success).toBe(true));

  test('#17 => machine/asyncActions.2.machine.ts', () =>
    expect(validate.safe(asyncMachine_2.config).success).toBe(true));

  test('#18 => machine/asyncActions.3.machine.ts', () =>
    expect(validate.safe(asyncMachine_3.config).success).toBe(true));

  test('#19 => machine/asyncActions.4.machine.ts', () =>
    expect(validate.safe(asyncMachine_4.config).success).toBe(true));

  test('#20 => machine/asyncActions.5.machine.ts', () =>
    expect(validate.safe(asyncMachine_5.config).success).toBe(true));

  test('#21 => machine/asyncActions.6.machine.ts', () =>
    expect(validate.safe(asyncMachine_6.config).success).toBe(true));

  test('#22 => machine/asyncActions.7.machine.ts', () =>
    expect(validate.safe(asyncMachine_7.config).success).toBe(true));

  test('#23 => machine/real.1.machine.ts', () =>
    expect(validate.safe(asyncMachine_8.config).success).toBe(true));

  test('#24 => machine/real.2.machine.ts', () =>
    expect(validate.safe(asyncMachine_9.config).success).toBe(true));

  test('#25 => machine/real.3.machine.ts', () =>
    expect(validate.safe(asyncMachine_10.config).success).toBe(true));
});
