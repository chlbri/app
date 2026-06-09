import { interpret } from '@bemedev/app';
import { createRoot } from 'solid-js';
import { describe, expect, test } from 'vitest';
import { useService } from '../useService';
import _machine from './common.machine';

describe('Integration with @bemedev/app machine and interpret', () => {
  const machine = _machine.provideOptions(({ assign }) => ({
    actions: {
      increment: assign('context', ({ context }) => ({
        count: context.count + 1,
      })),
    },
  }));

  const service = interpret(machine, { context: { count: 0 } });

  createRoot(dispose => {
    const count = useService(service, s => s.context.count);
    const value = useService(service, s => s.value);
    const all = useService(service);

    test('#000 => ALL, service not started yet', () => {
      const expected = {
        status: 'starting',
        context: { count: 0 },
        event: { type: 'machine$$init', payload: {} },
        value: 'idle',
        tags: ['idle_tag'],
      };

      expect(all()).toEqual(expected);
    });

    test('#001 => count should be 0', () => expect(count()).toBe(0));
    test('#002 => state is "idle"', () => expect(value()).toBe('idle'));
    test('#003 => starts the service', service.start);
    test('#004 => sends START event', () => service.send('START'));

    test('#005 => state transitions to active.speed_low', () => {
      expect(value()).toEqual({ active: 'speed_low' });
    });

    test('#006 => sends INC event', () => service.send('INC'));
    test('#007 => count should be 1', () => expect(count()).toBe(1));
    test('#008 => sends INC event', () => service.send('INC'));
    test('#009 => count should be 1', () => expect(count()).toBe(2));
    test('#010 => stops the service', service.stop);
    test('#011 => disposes the root context', dispose);
  });
});
