import { validate } from '@bemedev/app-valibot';
import atomicMachine from '#machines/helpers/edges/atomic.machine';
import arrayAssignAsyncAsync from '#machines/helpers/edges/arrayAssign/async.async.fsm';
import arrayAssignAsync from '#machines/helpers/edges/arrayAssign/async.fsm';
import arrayAssignComplex from '#machines/helpers/edges/arrayAssign/complex.fsm';
import arrayAssignComplexSync from '#machines/helpers/edges/arrayAssign/complex.sync.fsm';
import arrayAssignSync from '#machines/helpers/edges/arrayAssign/sync.machine';

describe('Edges machines validation', () => {
  test('#01 => atomic.machine', () =>
    expect(validate.safe(atomicMachine.config).success).toBe(true));

  test('#02 => arrayAssign async.async.fsm', () =>
    expect(validate.safe(arrayAssignAsyncAsync.config).success).toBe(
      true,
    ));

  test('#03 => arrayAssign async.fsm', () =>
    expect(validate.safe(arrayAssignAsync.config).success).toBe(true));

  test('#04 => arrayAssign complex.fsm', () =>
    expect(validate.safe(arrayAssignComplex.config).success).toBe(true));

  test('#05 => arrayAssign complex.sync.fsm', () =>
    expect(validate.safe(arrayAssignComplexSync.config).success).toBe(
      true,
    ));

  test('#06 => arrayAssign sync.machine', () =>
    expect(validate.safe(arrayAssignSync.config).success).toBe(true));
});
