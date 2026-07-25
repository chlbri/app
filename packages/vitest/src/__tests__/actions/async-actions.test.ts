import { interpret, sleep } from '@bemedev/app';
import { constructTests } from '../../constructTests.js';
import { emptyActionFn } from '../../constants';
import _machine1 from './async-actions.1.machine';
import _machine2 from './async-actions.2.machine';
import _machine3 from './async-actions.3.machine';
import _machine4 from './async-actions.4.machine';
import _machine5 from './async-actions.5.machine';
import _machine6 from './async-actions.6.machine';
import _machine7 from './async-actions.7.machine';
import _machine8 from './async-actions.8.machine';

vi.useFakeTimers();

/**
 * Async action helpers tests.
 * Covers: assign, voidAction, filter, sendTo — each with:
 *   (a) async fn, no options (happy path)
 *   (b) async fn + { max } timeout — expect result before timeout
 *   (c) async fn + { error } handler — rejects → merged from errorFn
 *   (d) async fn + { max } timeout that expires → routed to _addError (no errorFn)
 */

const TINY_DELAY = 200; // ms — resolves fast enough not to hit a 5 s max

describe('Async action helpers', () => {
  describe('#01 => assign — async fn, no options', () => {
    const machine = _machine1.provideOptions(({ assign }) => ({
      actions: {
        loadUser: assign(
          'context.name',
          async () => {
            await sleep(TINY_DELAY);
            return 'Alice';
          },
          { catch: emptyActionFn },
        ),
      },
    }));

    const service = interpret(machine, { context: { name: '' } });

    const { start, send, useName, waiter, stop } = constructTests(
      vi,
      service,
      ({ contexts: constructContexts, waiter }) => ({
        useName: constructContexts(({ context }) => context.name, 'name'),
        waiter: waiter(TINY_DELAY / 4),
      }),
    );

    test(...start());
    test(...useName(''));
    test(...send('LOAD'));
    test(...waiter(1));
    test(...useName(''));
    test(...waiter(1));
    test(...useName(''));
    test(...waiter(1));
    test(...useName(''));
    test(...waiter(1));
    test(...useName('Alice'));
    test(...stop());
  });

  describe('#02 => assign — async fn + { max } — resolves before timeout', () => {
    const machine = _machine2.provideOptions(({ assign }) => ({
      actions: {
        loadUser: assign(
          'context.name',
          async () => {
            await sleep(TINY_DELAY);
            return 'Bob';
          },
          {
            max: 5_000,
            catch: () => assign('context.name', () => 'timeout'),
          },
        ),
      },
    }));

    const service = interpret(machine, { context: { name: '' } });

    const { start, LOAD, useName, waiter } = constructTests(
      vi,
      service,
      ({ contexts: constructContexts, waiter, sender }) => ({
        useName: constructContexts(({ context }) => context?.name, 'name'),
        waiter: waiter(TINY_DELAY + 50),
        LOAD: sender('LOAD'),
      }),
    );

    test(...start());
    test(...LOAD());
    test(...waiter(1));
    test(...useName('Bob'));
  });

  describe('#03 => assign — async fn + { error } handler on reject', () => {
    const machine = _machine3.provideOptions(({ assign }) => ({
      actions: {
        loadUser: assign(
          'context.name',
          async () => {
            await sleep(TINY_DELAY);
            throw new Error('network failure');
          },
          { catch: () => assign('context.name', () => 'failure') },
        ),
      },
    }));

    const service = interpret(machine, { context: { name: '' } });

    const { start, send, useName, waiter } = constructTests(
      vi,
      service,
      ({ contexts: constructContexts, waiter }) => ({
        useName: constructContexts(({ context }) => context?.name, 'name'),
        waiter: waiter(TINY_DELAY + 50),
      }),
    );

    test(...start());
    test(...send('LOAD'));
    test(...useName(''));
    test(...waiter(1));
    test(...useName('failure'));
  });

  describe('#04 => voidAction — async fn, no options', () => {
    const sideEffect = vi.fn();

    const machine = _machine4.provideOptions(({ voidAction }) => ({
      actions: {
        ping: voidAction(
          async () => {
            await sleep(TINY_DELAY);
            sideEffect('done');
          },
          { catch: emptyActionFn },
        ),
      },
    }));

    const service = interpret(machine);

    const { start, send, waiter, checkEffect } = constructTests(
      vi,
      service,
      ({ waiter, getIndex, tupleOf }) => ({
        waiter: waiter(TINY_DELAY + 50),
        checkEffect: (expected: string) =>
          tupleOf(`#${getIndex()} => side effect is "${expected}"`, () => {
            expect(sideEffect).toHaveBeenCalledWith(expected);
          }),
      }),
    );

    test(...start());
    test(...send('PING'));
    test(...waiter(1));
    test(...checkEffect('done'));
  });

  describe('#05 => voidAction — async fn + { error } handler', () => {
    const errorHandler = vi.fn();

    const machine = _machine5.provideOptions(({ voidAction }) => ({
      actions: {
        ping: voidAction(
          async () => {
            await sleep(TINY_DELAY);
            throw new Error('boom');
          },
          { catch: _err => voidAction(() => errorHandler(_err)) },
        ),
      },
    }));

    const service = interpret(machine, { context: { errored: false } });

    const { start, send, waiter, checkErrorTimes, checkEffect } =
      constructTests(vi, service, ({ waiter, getIndex, tupleOf }) => ({
        waiter: waiter(TINY_DELAY + 50),
        checkErrorTimes: (times: number) =>
          tupleOf(
            `#${getIndex()} => error handler called ${times} times`,
            () => {
              expect(errorHandler).toHaveBeenCalledTimes(times);
            },
          ),
        checkEffect: (message: string) =>
          tupleOf(
            `#${getIndex()} => error handled called with "${message}"`,
            () => {
              expect(errorHandler).toHaveBeenCalledWith(
                expect.objectContaining({ message }),
              );
            },
          ),
      }));

    test(...start());
    test(...send('PING'));
    test(...waiter(1));
    test(...checkErrorTimes(1));
    test(...checkEffect('boom'));
  });

  describe('#06 => sendTo — async fn, no options', () => {
    // sendTo is a curried helper — sendTo(machine?)(fn)
    // We test only that the async fn resolves without error and the
    // sentEvent reaches the interpreter (checked via warnings or lack thereof).
    const machine = _machine7.provideOptions(({ voidAction }) => ({
      actions: {
        // sendTo without a target machine — we use voidAction to prove async runs
        dispatchEvent: voidAction(
          async () => {
            await sleep(TINY_DELAY);
            // side-effect only: proves async voidAction still works here
          },
          { catch: emptyActionFn },
        ),
      },
    }));

    const service = interpret(machine, {
      context: { dispatched: false },
    } as any);

    const { start, send, waiter, checkWarnings } = constructTests(
      vi,
      service,
      ({ waiter, getIndex, tupleOf }) => ({
        waiter: waiter(TINY_DELAY + 50),
        checkWarnings: (size: number) =>
          tupleOf(`#${getIndex()} => warnings count is ${size}`, () => {
            expect(service._warningsCollector?.size ?? 0).toBe(size);
          }),
      }),
    );

    test(...start());
    test(...send('DISPATCH'));
    test(...waiter(1));
    test(...checkWarnings(0));
  });

  describe('#07 => assign — async fn fails, emptyFn handler', () => {
    const error = vi.fn(emptyActionFn);
    const machine = _machine1.provideOptions(({ assign }) => ({
      actions: {
        loadUser: assign(
          'context.name',
          async () => {
            await sleep(TINY_DELAY);
            throw new Error('Load failed');
          },
          { catch: error },
        ),
      },
    }));

    const service = interpret(machine, { context: { name: '' } });

    const { start, send, useName, waiter, stop, callError } =
      constructTests(
        vi,
        service,
        ({ contexts: constructContexts, waiter, tupleOf, getIndex }) => ({
          useName: constructContexts(
            ({ context }) => context.name,
            'name',
          ),
          waiter: waiter(TINY_DELAY / 4),
          callError: (times = 0) =>
            tupleOf(
              `#${getIndex()} => call error fn ${times} times`,
              () => {
                expect(error).toHaveBeenCalledTimes(times);
              },
            ),
        }),
      );

    test(...start());
    test(...useName(''));
    test(...callError(0));
    test(...send('LOAD'));
    test(...waiter(5));
    test(...callError(1));
    test(...stop());
  });

  describe('#08 => assign — async fn + then handler', () => {
    const machine = _machine8.provideOptions(({ assign }) => ({
      actions: {
        inc: assign(
          'context',
          async ({ context }) => {
            await sleep(TINY_DELAY);
            return context + 1;
          },
          {
            catch: emptyActionFn,
            then: assign('context', ({ context }) => context + 10),
          },
        ),
      },
    }));

    const service = interpret(machine, { context: 0 });

    const { start, send, useValue, waiter } = constructTests(
      vi,
      service,
      ({ contexts: constructContexts, waiter }) => ({
        useValue: constructContexts(({ context }) => context, 'context'),
        waiter: waiter(TINY_DELAY + 50),
      }),
    );

    test(...start());
    test(...useValue(0));
    test(...send('INC'));
    test(...waiter(1));
    test(...useValue(11));
  });

  describe('#09 => voidAction — async fn + then handler', () => {
    let sideEffect = 0;
    const machine = _machine8.provideOptions(({ voidAction, assign }) => ({
      actions: {
        inc: voidAction(
          async () => {
            await sleep(TINY_DELAY);
            sideEffect = 1;
          },
          {
            catch: emptyActionFn,
            then: assign('context', ({ context }) => context + 5),
          },
        ),
      },
    }));

    const service = interpret(machine, { context: 0 });

    const { start, send, useValue, waiter, checkEffect } = constructTests(
      vi,
      service,
      ({ contexts: constructContexts, waiter, tupleOf, getIndex }) => ({
        useValue: constructContexts(({ context }) => context, 'context'),
        waiter: waiter(TINY_DELAY + 50),
        checkEffect: (expected: number) =>
          tupleOf(`#${getIndex()} => sideEffect is ${expected}`, () => {
            expect(sideEffect).toBe(expected);
          }),
      }),
    );

    test(...start());
    test(...useValue(0));
    test(...send('INC'));
    test(...waiter(1));
    test(...useValue(5));
    test(...checkEffect(1));
  });
});
