import { createConfig, createMachine, interpret } from '@bemedev/app';
import { nothing } from '@bemedev/app/utils';
import { type } from '@bemedev/typings';
import { describe, expect, test, vi } from 'vitest';

const config = createConfig({
  initial: 'idle',
  states: {
    idle: {
      on: {
        STATIC: { actions: 'static' },
        MAPPED: { actions: 'mapped' },
        FALLBACK: { actions: 'mapped' },
        DYNAMIC: { actions: 'dynamic' },
        ZERO: { actions: 'zero' },
        NEGATIVE: { actions: 'negative' },
        NOT_A_NUMBER: { actions: 'notANumber' },
        INFINITE: { actions: 'infinite' },
        NOOP: { actions: 'noop' },
        BLOCK: { actions: 'block' },
        SIBLING: { actions: 'sibling' },
        PLAIN: { actions: 'plain' },
        VOID: { actions: 'void' },
      },
    },
  },
});

const typings = {
  context: type({ count: 'number' }),
  eventsMap: type({
    STATIC: 'never',
    MAPPED: 'never',
    FALLBACK: 'never',
    DYNAMIC: 'never',
    ZERO: 'never',
    NEGATIVE: 'never',
    NOT_A_NUMBER: 'never',
    INFINITE: 'never',
    NOOP: 'never',
    BLOCK: 'never',
    SIBLING: 'never',
    PLAIN: 'never',
    VOID: 'never',
  }),
} as const;

const createTestMachine = () => createMachine(config, { ...typings, sync: true });

describe('SyncMachine - for', () => {
  describe('#01 => for a static count', () => {
    const machine = createTestMachine().provideOptions(({ _for, assign }) => ({
      actions: {
        static: _for(
          3,
          assign('count', ({ context }) => context.count + 1),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => context is at 0', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#03 => sends STATIC', () => service.send('STATIC'));

    test('#04 => action is repeated 3 times', () =>
      expect(service.state.context).toEqual({ count: 3 }));

    test('#05 => sends STATIC again', () => service.send('STATIC'));

    test('#06 => every iteration reads the merged context', () =>
      expect(service.state.context).toEqual({ count: 6 }));
  });

  describe('#02 => for a function map count', () => {
    const machine = createTestMachine().provideOptions(({ _for, assign }) => ({
      actions: {
        mapped: _for(
          { MAPPED: () => 2, else: () => 1 },
          assign('count', ({ context }) => context.count + 1),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends MAPPED', () => service.send('MAPPED'));

    test('#03 => matching key is used', () =>
      expect(service.state.context).toEqual({ count: 2 }));

    test('#04 => sends FALLBACK', () => service.send('FALLBACK'));

    test('#05 => else branch is used', () =>
      expect(service.state.context).toEqual({ count: 3 }));
  });

  describe('#03 => for a function count', () => {
    let captured: any = undefined;

    const countSpy = vi.fn((state: any) => {
      const { context, event } = state;
      captured = {
        context: structuredClone(context),
        event: event.type,
        hasPContext: 'pContext' in state,
      };
      return context.count;
    });

    const machine = createTestMachine().provideOptions(({ _for, assign }) => ({
      actions: {
        dynamic: _for(
          countSpy,
          assign('count', ({ context }) => context.count + 1),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 2 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends DYNAMIC', () => service.send('DYNAMIC'));

    test('#03 => count is resolved from the extended state', () => {
      expect(service.state.context).toEqual({ count: 4 });
    });

    test('#04 => count function is called once', () => {
      expect(countSpy).toHaveBeenCalledTimes(1);
    });

    test('#05 => count function receives the extended state', () => {
      expect(captured).toEqual({
        context: { count: 2 },
        event: 'DYNAMIC',
        hasPContext: true,
      });
    });
  });

  describe('#04 => for non-positive counts', () => {
    const machine = createTestMachine().provideOptions(({ _for, assign }) => ({
      actions: {
        zero: _for(
          0,
          assign('count', ({ context }) => context.count + 1),
        ),
        negative: _for(
          -3,
          assign('count', ({ context }) => context.count + 1),
        ),
        notANumber: _for(
          NaN,
          assign('count', ({ context }) => context.count + 1),
        ),
        infinite: _for(
          Infinity,
          assign('count', ({ context }) => context.count + 1),
        ),
        noop: _for(2, undefined),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends ZERO', () => service.send('ZERO'));

    test('#03 => zero count is a no-op', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#04 => sends NEGATIVE', () => service.send('NEGATIVE'));

    test('#05 => negative count is a no-op', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#06 => sends NOT_A_NUMBER', () => service.send('NOT_A_NUMBER'));

    test('#07 => NaN count is a no-op', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#08 => sends INFINITE', () => service.send('INFINITE'));

    test('#09 => infinite count is a no-op', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#10 => sends NOOP', () => service.send('NOOP'));

    test('#11 => undefined action is a no-op', () =>
      expect(service.state.context).toEqual({ count: 0 }));
  });

  describe('#05 => for with an undefined action skips the count', () => {
    const countSpy = vi.fn(() => 3);

    const machine = createTestMachine().provideOptions(({ _for }) => ({
      actions: { noop: _for(countSpy, undefined) },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends NOOP', () => service.send('NOOP'));

    test('#03 => context is unchanged', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#04 => count function is not called', () =>
      expect(countSpy).not.toHaveBeenCalled());
  });

  describe('#06 => for a batch action', () => {
    const machine = createTestMachine().provideOptions(
      ({ _for, assign, batch }) => ({
        actions: {
          block: _for(
            2,
            batch(
              assign('count', ({ context }) => context.count + 1),
              assign('count', ({ context }) => context.count + 1),
            ),
          ),
        },
      }),
    );

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());

    test('#02 => sends BLOCK', () => service.send('BLOCK'));

    test('#03 => the batch is repeated 2 times', () =>
      expect(service.state.context).toEqual({ count: 4 }));
  });

  describe('#07 => for inside a batch is seen by a sibling action', () => {
    let seen = -1;

    const machine = createTestMachine().provideOptions(
      ({ _for, assign, batch, action }) => ({
        actions: {
          sibling: batch(
            _for(
              2,
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

    test('#03 => sibling action observes the merged context', () =>
      expect(seen).toBe(2));

    test('#04 => context is committed', () =>
      expect(service.state.context).toEqual({ count: 2 }));
  });

  describe('#08 => for actions without mergers', () => {
    const machine = createTestMachine().provideOptions(({ _for, action }) => ({
      actions: {
        plain: _for(3, action(nothing)),
        void: _for(
          2,
          action(() => undefined),
        ),
      },
    }));

    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => starts the service', () => service.start());
    test('#02 => sends PLAIN', () => service.send('PLAIN'));

    test('#03 => action without mergers is repeated', () =>
      expect(service.state.context).toEqual({ count: 0 }));

    test('#04 => sends VOID', () => service.send('VOID'));

    test('#05 => action returning undefined is supported', () =>
      expect(service.state.context).toEqual({ count: 0 }));
  });
});
