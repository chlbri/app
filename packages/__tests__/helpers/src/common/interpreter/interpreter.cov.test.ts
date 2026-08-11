import { describe, expect, test } from 'vitest';
import { createMachine } from '@bemedev/app';
import { interpret } from '@bemedev/app';
import { type } from '@bemedev/typings';

describe('TESTS', () => {
  const machine = createMachine(
    {
      initial: 'idle',
      states: {
        idle: { on: { INC: { target: '/active', actions: ['inc'] } } },
        active: {
          on: {
            INC: { target: '/active', actions: ['inc'] },
            INC2: '/idle',
          },
        },
      },
    },
    { context: type({ count: 'number' }), sync: true },
  ).provideOptions(({ assign }) => ({
    actions: {
      inc: assign(
        'context.count',
        ({ context }) => (context?.count ?? 0) + 1,
      ),
    },
  }));

  describe('#01 => softReset', () => {
    const service = interpret(machine, { context: { count: 0 } });

    test('#01 => start the machine', service.start);

    test('#02 => cannot INC2 initially', () =>
      expect(service.canEvents('INC2')).toBe(false));

    test('#03 => send INC event', () => {
      service.send('INC');
    });

    test('#04 => can INC2 event', () =>
      expect(service.canEvents('INC2')).toBe(true));

    test('#05 => state value is active', () =>
      expect(service.state.value).toBe('active'));

    test('#06 => context count is 1', () =>
      expect(service.state.context.count).toBe(1));

    test('#07 => softReset', service.softReset);

    test('#08 => state value is reset', () =>
      expect(service.state.value).toBe('idle'));

    test('#09 => context count is reset', () =>
      expect(service.state.context.count).toBe(0));

    test('#10 => softReset sets status to idle', () =>
      expect(service.status).toBe('idle'));
  });

  describe('#02 => reset', () => {
    const service = interpret(machine, { context: { count: 0 } });
    const spy = vi.fn();
    let callsLength = 0;
    service.subscribe(spy);

    test('#01 => start the machine', service.start);

    test('#02 => send INC event', () => {
      service.send('INC');
    });

    test('#03 => state value is active', () =>
      expect(service.state.value).toBe('active'));

    test('#04 => context count is 1', () =>
      expect(service.state.context.count).toBe(1));

    test('#05 => reset', () => {
      service.reset();
      callsLength = spy.mock.calls.length;
    });

    test('#06 => spy call count matches after reset', () =>
      expect(spy).toHaveBeenCalledTimes(callsLength));

    test('#07 => state value is reset', () =>
      expect(service.state.value).toBe('idle'));

    test('#08 => context count is reset', () =>
      expect(service.state.context.count).toBe(0));

    test('#09 => status is paused', () =>
      expect(service.status).toBe('paused'));

    test('#10 => send INC event when paused', () => {
      service.send('INC');
    });

    test('#11 => context count is unchanged when paused', () =>
      expect(service.state.context.count).toBe(1));

    test('#12 => spy call count is unchanged when paused', () =>
      expect(spy).toHaveBeenCalledTimes(callsLength));
  });
});
