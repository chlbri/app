import { interpret } from '@bemedev/app';
import { createHooks, useService } from '@bemedev/app-reactjs';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import _machine from './common.machine';

describe('#01 => useService', () => {
  const machine = _machine.provideOptions(({ assign }) => ({
    actions: {
      increment: assign(
        'count',
        ({ context }) => context.count + 1,
      ),
    },

  }));

  const service = interpret(machine, { context: { count: 0 } });

  const { result } = renderHook(() => {
    const _service = useService(service);
    const all = _service.state();
    const value = _service.state({ selector: s => s.value });
    const count = _service.state({
      selector: s => s.context.count,
      equals: (a, b) => a === b,
    });

    const canStart = _service.can('START');
    const canAnd = _service.can.and('START', 'STOP');
    const canOr = _service.can.or('START', 'STOP');
    const canIncAndStop = _service.can.and('INC', 'STOP');

    const isIdle = createHooks(service).isInside('idle');
    const isOr = _service.isInside.or('idle', 'active');
    const isAnd = _service.isInside('active', 'active.speed_low');
    const isSpeedLow = _service.isInside('active.speed_low');
    const isSpeedHigh = _service.isInside.and(
      'active',
      'active.speed_high',
    );

    return {
      all,
      value,
      count,
      canStart,
      canAnd,
      canOr,
      canIncAndStop,
      isIdle,
      isOr,
      isAnd,
      isSpeedLow,
      isSpeedHigh,
    };
  });

  test('#00 => ALL, service not started yet', () => {
    const expected = {
      status: 'idle',
      context: { count: 0 },
      event: { type: 'machine$$init', payload: {} },
      value: 'idle',
      tags: ['idle_tag'],
    };

    expect(result.current.all).toEqual(expected);
  });

  test('#01 => count should be 0', () => {
    expect(result.current.count).toBe(0);
  });

  test('#02 => state is "idle"', () => {
    expect(result.current.value).toBe('idle');
  });

  test('#03 => can START is true', () => {
    expect(result.current.canStart).toBe(true);
  });

  test('#04 => canAnd is false', () => {
    expect(result.current.canAnd).toBe(false);
  });

  test('#05 => canOr is true', () => {
    expect(result.current.canOr).toBe(true);
  });

  test('#06 => canIncAndStop is false', () => {
    expect(result.current.canIncAndStop).toBe(false);
  });

  test('#07 => is idle is true', () => {
    expect(result.current.isIdle).toBe(true);
  });

  test('#08 => state is "idle" or "active"', () => {
    expect(result.current.isOr).toBe(true);
  });

  test('#09 => isAnd is false', () => {
    expect(result.current.isAnd).toBe(false);
  });

  test('#10 => isSpeedLow is false', () => {
    expect(result.current.isSpeedLow).toBe(false);
  });

  test('#11 => isSpeedHigh is false', () => {
    expect(result.current.isSpeedHigh).toBe(false);
  });

  test('#12 => starts the service', () => act(() => service.start()));
  test('#13 => sends START event', () => act(() => service.send('START')));

  test('#14 => state transitions to active.speed_low', () => {
    expect(result.current.value).toEqual({ active: 'speed_low' });
  });

  test('#15 => can START is false', () => {
    expect(result.current.canStart).toBe(false);
  });

  test('#16 => canOr is true', () => {
    expect(result.current.canOr).toBe(true);
  });

  test('#17 => canIncAndStop is true', () => {
    expect(result.current.canIncAndStop).toBe(true);
  });

  test('#18 => is idle is false', () => {
    expect(result.current.isIdle).toBe(false);
  });

  test('#19 => state is "idle" or "active"', () => {
    expect(result.current.isOr).toBe(true);
  });

  test('#20 => isAnd is true', () => {
    expect(result.current.isAnd).toBe(true);
  });

  test('#21 => is speed_low', () => {
    expect(result.current.isSpeedLow).toBe(true);
  });

  test('#22 => is speed_high is false', () => {
    expect(result.current.isSpeedHigh).toBe(false);
  });

  test('#23 => sends ACCELERATE event', () => {
    act(() => service.send('ACCELERATE'));
  });

  test('#24 => state transitions to active.speed_high', () => {
    expect(result.current.value).toEqual({ active: 'speed_high' });
  });

  test('#25 => is speed_low is false', () => {
    expect(result.current.isSpeedLow).toBe(false);
  });

  test('#26 => is speed_high is true', () => {
    expect(result.current.isSpeedHigh).toBe(true);
  });

  test('#27 => sends DECELERATE event', () => {
    act(() => service.send('DECELERATE'));
  });

  test('#28 => is speed_low is true', () => {
    expect(result.current.isSpeedLow).toBe(true);
  });

  test('#29 => sends INC event', () => act(() => service.send('INC')));

  test('#30 => count should be 1', () => {
    expect(result.current.count).toBe(1);
  });

  test('#31 => sends INC event', () => act(() => service.send('INC')));

  test('#32 => count should be 2', () => {
    expect(result.current.count).toBe(2);
  });

  test('#33 => stops the service', () => act(() => service.stop()));
});
