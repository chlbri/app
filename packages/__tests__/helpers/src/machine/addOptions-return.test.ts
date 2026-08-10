import { interpret } from '@bemedev/app';
import _machine1 from './addOptions-return.1.machine';
import _machine2 from './addOptions-return.2.machine';
import _machine3 from './addOptions-return.3.machine';
import _machine4 from './addOptions-return.4.machine';

describe('Machine addOptions return', () => {
  describe('#01 => should return the options object from machine.addOptions', () => {
    const machine = _machine1;

    const result = machine.addOptions(({ assign }) => ({
      actions: {
        increment: assign('context', ({ context }) => context + 1),
      },
    }));

    test('#01 => result is defined', () => expect(result).toBeDefined());
    test('#02 => result.actions is defined', () => expect(result?.actions).toBeDefined());

    test('#03 => result.actions.increment is defined', () =>
      expect(result?.actions?.increment).toBeDefined());

    test('#04 => result.actions.increment is a function', () =>
      expect(typeof result?.actions?.increment).toBe('function'));
  });

  test('#02 => should return undefined when callback returns undefined', () => {
    const machine = _machine2;

    const result = machine.addOptions(() => undefined as any);

    expect(result).toBeUndefined();
  });

  describe('#03 => should return options with multiple properties', () => {
    const machine = _machine3;

    const result = machine.addOptions(({ assign }) => ({
      actions: { setZero: assign('context', () => 0) } as any,
      guards: { isPositive: ({ context }) => context > 0 },
      delays: { shortDelay: () => 100 } as any,
    }));

    test('#01 => result is defined', () => expect(result).toBeDefined());
    test('#02 => result.actions is defined', () => expect(result?.actions).toBeDefined());
    test('#03 => result.guards is defined', () => expect(result?.guards).toBeDefined());
    test('#04 => result.delays is defined', () => expect(result?.delays).toBeDefined());
  });

  describe('#04 => should still add options to machine even when capturing return value', () => {
    const machine = _machine4.renew;
    const result = machine.addOptions(({ assign }) => ({
      actions: {
        increment: assign('context', ({ context }) => context + 1),
      },
    }));

    test('#01 => result is defined', () => expect(result).toBeDefined());

    // Verify the machine actually has the options applied
    test('#02 => context starts at 0 after start', () => {
      const service = interpret(machine, { context: 0 });
      service.start();
      expect(service.state.context).toBe(0);
    });

    test('#03 => context is 1 after sending INCREMENT', async () => {
      const service = interpret(machine, { context: 0 });
      service.start();
      await service.send('INCREMENT');
      expect(service.state.context).toBe(1);
    });
  });
});
