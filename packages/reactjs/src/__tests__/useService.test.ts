import { interpret } from '@bemedev/app';
import { act, renderHook } from '@testing-library/react';
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

  const { result } = renderHook(() => {
    const count = useService(service, s => s.context.count);
    const value = useService(service, s => s.value);
    const all = useService(service);
    return { count, value, all };
  });

  test('#000 => ALL, service not started yet', () => {
    const expected = {
      status: 'starting',
      context: { count: 0 },
      event: { type: 'machine$$init', payload: {} },
      value: 'idle',
      tags: ['idle_tag'],
    };

    expect(result.current.all).toEqual(expected);
  });

  test('#001 => count is 0', () => {
    expect(result.current.count).toBe(0);
  });

  test('#002 => state is "idle"', () => {
    expect(result.current.value).toBe('idle');
  });

  test('#003 => starts the service', () => act(service.start));

  test('#004 => sends START event', () => {
    act(() => service.send('START'));
  });

  test('#005 => state transitions to active.speed_low', () => {
    expect(result.current.value).toEqual({ active: 'speed_low' });
  });

  test('#006 => sends INC event', () => {
    act(() => service.send('INC'));
  });

  test('#007 => count is 1', () => {
    expect(result.current.count).toBe(1);
  });

  test('#008 => sends INC event', () => {
    act(() => service.send('INC'));
  });

  test('#009 => count is 2', () => {
    expect(result.current.count).toBe(2);
  });

  test('#010 => stops the service', () => act(service.stop));
});
