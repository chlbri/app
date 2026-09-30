import { createMachine, interpret } from '@bemedev/app';
import { type } from '@bemedev/typings';
import { describe, expect, test, vi } from 'vitest';

const _machine = createMachine(
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          WHILE_COND: { actions: 'whileCond' },
          WHILE_FALSE: { actions: 'whileFalse' },
          WHILE_MAP: { actions: 'whileMap' },
          WHILE_NOOP: { actions: 'whileNoop' },
          DO_WHILE_FALSE: { actions: 'doWhileFalse' },
          DO_WHILE_COND: { actions: 'doWhileCond' },
          DO_WHILE_NOOP: { actions: 'doWhileNoop' },
          SIBLING: { actions: 'sibling' },
        },
      },
    },
  },
  {
    context: type({ count: 'number' }),
    eventsMap: type({
      WHILE_COND: 'never',
      WHILE_FALSE: 'never',
      WHILE_MAP: 'never',
      WHILE_NOOP: 'never',
      DO_WHILE_FALSE: 'never',
      DO_WHILE_COND: 'never',
      DO_WHILE_NOOP: 'never',
      SIBLING: 'never',
    }),
    sync: true,
  },
);

const createTestMachine = () => _machine.renew;

describe('SyncMachine - _while & _doWhile', () => {
  describe('#01 => _while with a context predicate', () => {
    const predicate = vi.fn(({ context }: any) => context.count < 3);

    const machine = createTestMachine().provideOptions(({ _while, assign }) => ({
      actions: {
        whileCond: _while(
          predicate,
          assign('count', ({ context }) => context.count + 1),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends WHILE_COND', () => service.send('WHILE_COND'));

    test('#03 => action is repeated while the predicate holds', () =>
      expect(service.state.context).toEqual({ count: 3 }));

    test('#04 => predicate is re-evaluated before each iteration', () =>
      expect(predicate).toHaveBeenCalledTimes(4));
  });

  describe('#02 => _while with a false predicate', () => {
    const predicate = vi.fn(() => false);

    const machine = createTestMachine().provideOptions(({ _while, assign }) => ({
      actions: {
        whileFalse: _while(
          predicate,
          assign('count', ({ context }) => context.count + 1),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends WHILE_FALSE', () => service.send('WHILE_FALSE'));

    test('#03 => action is never executed', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#04 => predicate is evaluated once', () =>
      expect(predicate).toHaveBeenCalledTimes(1));
  });

  describe('#03 => _while with a function map predicate', () => {
    const machine = createTestMachine().provideOptions(({ _while, assign }) => ({
      actions: {
        whileMap: _while(
          { WHILE_MAP: ({ context }) => context.count < 3, else: () => false },
          assign('count', ({ context }) => context.count + 1),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends WHILE_MAP', () => service.send('WHILE_MAP'));

    test('#03 => matching event branch drives the loop', () =>
      expect(service.state.context).toEqual({ count: 3 }));
  });

  describe('#04 => _while with an undefined action', () => {
    const predicate = vi.fn(() => true);

    const machine = createTestMachine().provideOptions(({ _while }) => ({
      actions: { whileNoop: _while(predicate, undefined) },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends WHILE_NOOP', () => service.send('WHILE_NOOP'));

    test('#03 => context is unchanged', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#04 => predicate is not evaluated', () =>
      expect(predicate).not.toHaveBeenCalled());
  });

  describe('#05 => _doWhile with a false predicate', () => {
    const predicate = vi.fn(() => false);

    const machine = createTestMachine().provideOptions(({ _doWhile, assign }) => ({
      actions: {
        doWhileFalse: _doWhile(
          predicate,
          assign('count', ({ context }) => context.count + 1),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends DO_WHILE_FALSE', () => service.send('DO_WHILE_FALSE'));

    test('#03 => action is executed at least once', () =>
      expect(service.state.context).toEqual({ count: 1 }));

    test('#04 => predicate is evaluated after the iteration', () =>
      expect(predicate).toHaveBeenCalledTimes(1));
  });

  describe('#06 => _doWhile with a context predicate', () => {
    const predicate = vi.fn(({ context }: any) => context.count < 3);

    const machine = createTestMachine().provideOptions(({ _doWhile, assign }) => ({
      actions: {
        doWhileCond: _doWhile(
          predicate,
          assign('count', ({ context }) => context.count + 1),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends DO_WHILE_COND', () => service.send('DO_WHILE_COND'));

    test('#03 => action is repeated while the predicate holds', () =>
      expect(service.state.context).toEqual({ count: 3 }));

    test('#04 => predicate is evaluated after each iteration', () =>
      expect(predicate).toHaveBeenCalledTimes(3));
  });

  describe('#07 => _doWhile with an undefined action', () => {
    const predicate = vi.fn(() => true);

    const machine = createTestMachine().provideOptions(({ _doWhile }) => ({
      actions: { doWhileNoop: _doWhile(predicate, undefined) },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends DO_WHILE_NOOP', () => service.send('DO_WHILE_NOOP'));

    test('#03 => context is unchanged', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#04 => predicate is not evaluated', () =>
      expect(predicate).not.toHaveBeenCalled());
  });

  describe('#08 => _while inside a batch is seen by a sibling action', () => {
    let seen = -1;

    const machine = createTestMachine().provideOptions(
      ({ _while, assign, batch, action }) => ({
        actions: {
          sibling: batch(
            _while(
              ({ context }) => context.count < 2,
              assign('count', ({ context }) => context.count + 1),
            ),
            action(({ context }) => {
              seen = context.count;
            }),
          ),
        },
      }),
    );

    const service = interpret(machine, { context: { count: 0 } });
    test('#01 => starts the service', () => service.start());
    test('#02 => sends SIBLING', () => service.send('SIBLING'));

    test('#03 => sibling action observes the merged context', () => {
      expect(seen).toBe(2);
    });

    test('#04 => context is committed', () => {
      expect(service.state.context).toEqual({ count: 2 });
    });
  });

  describe('#09 => _doWhile execute once even when guard returns always true', () => {
    const predicate = vi.fn(() => false);
    let visiteds = 0;

    const machine = createTestMachine().provideOptions(({ _doWhile, action }) => ({
      actions: {
        doWhileNoop: _doWhile(
          predicate,
          action(() => {
            visiteds++;
          }),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends DO_WHILE_NOOP', () => service.send('DO_WHILE_NOOP'));

    test('#03 => context is unchanged', () => {
      expect(service.state.context).toEqual({ count: 0 });
    });

    test('#04 => action is visited', () => expect(visiteds).toBe(1));
    test('#05 => sends DO_WHILE_NOOP', () => service.send('DO_WHILE_NOOP'));

    test('#06 => context is unchanged', () => {
      expect(service.state.context).toEqual({ count: 0 });
    });

    test('#07 => action is visited', () => expect(visiteds).toBe(2));

    test('#08 => predicate is evaluated', () => {
      expect(predicate).toHaveBeenCalledTimes(2);
    });
  });
});
