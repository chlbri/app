import { interpret } from '@bemedev/app';
import {
  createHooks,
  useCan,
  useIsInside,
  useService,
  useState,
} from '@bemedev/app-reactjs';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import _machine from './common.machine';

describe('#01 => useService', () => {
  const machine = _machine.provideOptions(({ assign }) => ({
    actions: {
      increment: assign('count', ({ context }) => context.count + 1),
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
    const isSpeedHigh = _service.isInside.and('active', 'active.speed_high');

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

describe('#02 => standalone useState', () => {
  const machine = _machine.provideOptions(({ assign }) => ({
    actions: {
      increment: assign('count', ({ context }) => context.count + 1),
    },
  }));

  const service = interpret(machine, { context: { count: 10 } });

  const { result } = renderHook(() =>
    useState(service, {
      selector: s => s.context.count,
      equals: (a, b) => a === b,
    }),
  );

  test('#00 => initial count is 10', () => {
    expect(result.current).toBe(10);
  });

  test('#01 => starts the service', () => act(() => service.start()));
  test('#02 => sends START event', () => act(() => service.send('START')));
  test('#03 => sends INC event', () => act(() => service.send('INC')));

  test('#04 => count should be 11', () => {
    expect(result.current).toBe(11);
  });

  test('#05 => stops the service', () => act(() => service.stop()));
});

describe('#03 => standalone useCan addons', () => {
  const machine = _machine.provideOptions(({ assign }) => ({
    actions: {
      increment: assign('count', ({ context }) => context.count + 1),
    },
  }));

  const service = interpret(machine, { context: { count: 0 } });

  const { result } = renderHook(() => {
    const can = useCan(service);
    const canStart = can('START');
    const canAnd = can.and('START', 'STOP');
    const canOr = can.or('START', 'STOP');
    return { canStart, canAnd, canOr };
  });

  test('#00 => can START initially is true', () => {
    expect(result.current.canStart).toBe(true);
  });

  test('#01 => canAnd is false', () => {
    expect(result.current.canAnd).toBe(false);
  });

  test('#02 => canOr is true', () => {
    expect(result.current.canOr).toBe(true);
  });

  test('#03 => starts the service', () => act(() => service.start()));
  test('#04 => sends START event', () => act(() => service.send('START')));

  test('#05 => can START is false after start', () => {
    expect(result.current.canStart).toBe(false);
  });

  test('#06 => canOr is true after start', () => {
    expect(result.current.canOr).toBe(true);
  });

  test('#07 => stops the service', () => act(() => service.stop()));
});

describe('#04 => standalone useIsInside addons', () => {
  const machine = _machine.provideOptions(({ assign }) => ({
    actions: {
      increment: assign('count', ({ context }) => context.count + 1),
    },
  }));

  const service = interpret(machine, { context: { count: 0 } });

  const { result } = renderHook(() => {
    const isInside = useIsInside(service);
    const isIdle = isInside('idle');
    const isOr = isInside.or('idle', 'active');
    const isAnd = isInside.and('active', 'active.speed_low');
    return { isIdle, isOr, isAnd };
  });

  test('#00 => is idle initially true', () => {
    expect(result.current.isIdle).toBe(true);
  });

  test('#01 => isOr is true', () => {
    expect(result.current.isOr).toBe(true);
  });

  test('#02 => isAnd is false', () => {
    expect(result.current.isAnd).toBe(false);
  });

  test('#03 => starts the service', () => act(() => service.start()));
  test('#04 => sends START event', () => act(() => service.send('START')));

  test('#05 => is idle is false', () => {
    expect(result.current.isIdle).toBe(false);
  });

  test('#06 => isAnd is true', () => {
    expect(result.current.isAnd).toBe(true);
  });

  test('#07 => stops the service', () => act(() => service.stop()));
});

describe('#05 => stateEquals vs equals difference in useState', () => {
  const machine = _machine.provideOptions(({ assign }) => ({
    actions: {
      increment: assign('count', ({ context }) => context.count + 1),
    },
  }));

  const service = interpret(machine, { context: { count: 0 } });

  // 1. Ignores context changes because stateEquals checks only value
  const valueOnly = renderHook(() =>
    useState(service, {
      selector: s => s.context.count,
      stateEquals: (prev, next) =>
        JSON.stringify(prev.value) === JSON.stringify(next.value),
      equals: (a, b) => a === b,
    }),
  );

  // 2. Normal state tracking
  const defaultState = renderHook(() =>
    useState(service, {
      selector: s => s.context.count,
      equals: (a, b) => a === b,
    }),
  );

  // 3. Notifies via stateEquals but equals ignores changes
  const equalsAlwaysTrue = renderHook(() =>
    useState(service, {
      selector: s => s.context.count,
      stateEquals: () => false,
      equals: () => true,
    }),
  );

  test('#00 => initial counts are all 0', () => {
    expect(valueOnly.result.current).toBe(0);
    expect(defaultState.result.current).toBe(0);
    expect(equalsAlwaysTrue.result.current).toBe(0);
  });

  test('#01 => starts the service', () => act(() => service.start()));
  test('#02 => sends START event', () => act(() => service.send('START')));

  test('#03 => counts remain 0 after START transition', () => {
    expect(valueOnly.result.current).toBe(0);
    expect(defaultState.result.current).toBe(0);
    expect(equalsAlwaysTrue.result.current).toBe(0);
  });

  test('#04 => sends INC event', () => act(() => service.send('INC')));

  test('#05 => defaultState is 1, valueOnly is still 0 because value did not change', () => {
    expect(defaultState.result.current).toBe(1);
    expect(valueOnly.result.current).toBe(0);
    expect(equalsAlwaysTrue.result.current).toBe(0);
  });

  test('#06 => sends INC event again', () => act(() => service.send('INC')));

  test('#07 => defaultState is 2, valueOnly is still 0', () => {
    expect(defaultState.result.current).toBe(2);
    expect(valueOnly.result.current).toBe(0);
    expect(equalsAlwaysTrue.result.current).toBe(0);
  });

  test('#08 => sends ACCELERATE event changing state.value', () => {
    act(() => service.send('ACCELERATE'));
  });

  test('#09 => valueOnly now updates to 2 because value changed', () => {
    expect(valueOnly.result.current).toBe(2);
    expect(defaultState.result.current).toBe(2);
    expect(equalsAlwaysTrue.result.current).toBe(0);
  });

  test('#10 => stops the service', () => act(() => service.stop()));
});
