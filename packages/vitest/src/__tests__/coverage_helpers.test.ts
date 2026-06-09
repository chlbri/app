import { createMachine, interpret } from '@bemedev/app';
import { constructTests } from '../constructTests';
import { buildIndex } from '../invite';
import { describe, expect, test, vi } from 'vitest';
import { type } from '@bemedev/typings';

describe('Coverage tests for constructTests', () => {
  const machine = createMachine(
    {
      initial: 'idle',
      states: {
        idle: {
          tags: ['tag1'],
          on: { NEXT: '/done' },
        },
        done: {},
      },
    },
    {
      context: type('number'),
    },
  );

  const service = interpret(machine, { context: 0 });
  const {
    start,
    stop,
    dispose,
    pause,
    resume,
    useStateValue,
    useWarnings,
    useErrors,
    changeIndex,
    unhandledRejection,
    send,
    useTags,
    wait,
    sendNext,
    checkCtx,
  } = constructTests(
    vi,
    service,
    ({ waiter, sender, contexts, tupleOf }) => ({
      wait: waiter(10),
      sendNext: sender('NEXT'),
      checkCtx: contexts(),
      customTuple: tupleOf('custom invite', () => {}),
    }),
  );

  test(...start());
  test(...useStateValue('idle'));
  test(...useTags('tag1'));

  // Test contexts helper
  test(...checkCtx({ context: 0, pContext: undefined }));

  // Test warning/error collectors
  test('simulate warnings', () => {
    (service as any)._addWarning('some warning');
    (service as any)._addError('some error');
  });

  // Call the registration functions directly to register test.each blocks
  useWarnings('some warning')[1]();
  useErrors('some error')[1]();

  test('clear warnings and errors', () => {
    (service as any)._warningsCollector.clear();
    (service as any)._errorsCollector.clear();
  });

  // Test send / sender
  test(...sendNext());
  test(...useStateValue('done'));

  // Test changeIndex
  test(...changeIndex(idx => idx + 10));

  // Test other control paths
  test(...pause());
  test(...resume());
  test(...stop());
  test(...dispose());
  test(...wait());

  // Test send with custom index
  test(...send({ type: 'NEXT' } as any, 99));

  // Test unhandledRejection
  test(
    ...unhandledRejection(() => {
      throw new Error('test error');
    }, 'test error'),
  );

  // Test buildIndex error boundaries
  test('buildIndex error boundaries', () => {
    expect(() => buildIndex(-1, 5)).toThrow();
    expect(() => buildIndex(10, 5)).toThrow();
  });
});
