import {
  INIT_EVENT,
  MAX_EXCEEDED_EVENT_TYPE,
  type EventsMap,
} from '@bemedev/app/events';
import { numbersT, stringsT } from '@bemedev/app-utils-bemedev';
import type {
  FnMap,
  FnMapFilterArray,
  FnMapFilterObject,
  FnMapR,
} from '@bemedev/app/types';
import {
  reduceFnMap,
  reduceFnMapFilterArray,
  reduceFnMapFilterObject,
  reduceFnMapReduced,
} from '@bemedev/app/utils';

describe('reduceFnMap tests', () => {
  describe('#01 => reduceFnMap', () => {
    describe('#01 => returns function directly if it is already a function', () => {
      // Arrange
      const events: EventsMap = {};
      const directFn = () => 'result';

      // Act
      const result = reduceFnMap(directFn, ...Object.keys(events));

      // Assert
      test('#01 => result is the direct function', () =>
        expect(result).toBe(directFn));

      test('#02 => result returns "result" when called', () =>
        expect(
          result({
            event: { type: INIT_EVENT, payload: {} },
            context: {},
            pContext: {},
            status: 'active' as any,
            value: 'test',
            tags: [],
          }),
        ).toBe('result'));
    });

    describe('#02 => correctly handles string type event', () => {
      // Arrange
      const events: EventsMap = { EVENT1: stringsT.type };
      const elseSpy = vi.fn().mockReturnValue('else result');

      const fnMap: FnMap<any, any, any, any, string> = {
        EVENT1: () => 'event1 result',
        else: elseSpy,
      };

      // Act
      const reducedFn = reduceFnMap(fnMap, ...Object.keys(events));
      const result = reducedFn({
        event: INIT_EVENT,
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      // Assert
      test('#01 => elseSpy was called correctly', () =>
        expect(elseSpy).toHaveBeenCalledWith({
          event: INIT_EVENT,
          context: {},
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#02 => result is "else result"', () =>
        expect(result).toBe('else result'));
    });

    describe('#03 => correctly executes mapped event functions', () => {
      // Arrange
      const events: EventsMap = {
        EVENT1: stringsT.type,
        EVENT2: numbersT.type,
      };
      const event1Fn = vi.fn().mockReturnValue('event1 result');
      const event2Fn = vi.fn().mockReturnValue('event2 result');
      const elseFn = vi.fn().mockReturnValue('else result');

      const fnMap: FnMap<any, any, any, any, string> = {
        EVENT1: event1Fn,
        EVENT2: event2Fn,
        else: elseFn,
      };

      // Act
      const reducedFn = reduceFnMap(fnMap, ...Object.keys(events));

      const result1 = reducedFn({
        event: { type: 'EVENT1', payload: 'test payload' },
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      const result2 = reducedFn({
        event: { type: 'EVENT2', payload: 123 },
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      const result3 = reducedFn({
        event: { type: 'UNKNOWN', payload: null },
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      // Assert
      test('#01 => event1Fn was called with correct payload', () =>
        expect(event1Fn).toHaveBeenCalledWith({
          context: {},
          pContext: {},
          payload: 'test payload',
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#02 => event2Fn was called with correct payload', () =>
        expect(event2Fn).toHaveBeenCalledWith({
          context: {},
          pContext: {},
          payload: 123,
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#03 => elseFn was called with full event for unknown event', () =>
        expect(elseFn).toHaveBeenCalledWith({
          context: {},
          pContext: {},
          event: { type: 'UNKNOWN', payload: null },
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#04 => result1 is "event1 result"', () =>
        expect(result1).toBe('event1 result'));
      test('#05 => result2 is "event2 result"', () =>
        expect(result2).toBe('event2 result'));
      test('#06 => result3 is "else result"', () =>
        expect(result3).toBe('else result'));
    });

    test('#04 => uses nothing as default else function', () => {
      // Arrange
      const events: EventsMap = { EVENT1: stringsT.type };

      const fnMap: FnMap<any, any, any, any, string> = {
        EVENT1: () => 'event1 result',
      };

      // Act
      const reducedFn = reduceFnMap(fnMap, ...Object.keys(events));
      const result = reducedFn({
        event: { type: 'UNKNOWN', payload: null },
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      // Assert
      expect(result).toBe('nothing');
    });

    describe('#05 => MAX_EXCEEDED_EVENT_TYPE', () => {
      // Arrange
      const events: EventsMap = {
        [MAX_EXCEEDED_EVENT_TYPE]: numbersT.type,
      };
      const eventFn = vi.fn().mockReturnValue('max exceeded result');

      const fnMap: FnMap<any, any, any, any, string> = {
        [MAX_EXCEEDED_EVENT_TYPE]: eventFn,
      };

      // Act
      const reducedFn = reduceFnMap(fnMap, ...Object.keys(events));
      const result = reducedFn({
        event: { type: MAX_EXCEEDED_EVENT_TYPE, payload: 123 },
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      // Assert
      test('#01 => eventFn was called with correct payload', () =>
        expect(eventFn).toHaveBeenCalledWith({
          context: {},
          pContext: {},
          payload: 123,
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#02 => result is "max exceeded result"', () =>
        expect(result).toBe('max exceeded result'));
    });
  });

  describe('#02 => reduceFnMapReduced', () => {
    describe('#01 => returns function directly if it is already a function', () => {
      // Arrange
      const events: EventsMap = {};
      const directFn = () => 'result';

      // Act
      const result = reduceFnMapReduced(directFn, ...Object.keys(events));

      // Assert
      test('#01 => result is the direct function', () =>
        expect(result).toBe(directFn));

      test('#02 => result returns "result" when called', () =>
        expect(
          result({
            context: {},
            event: { type: MAX_EXCEEDED_EVENT_TYPE, payload: {} },
            status: 'active' as any,
            value: 'test',
            tags: [],
          }),
        ).toBe('result'));
    });

    describe('#02 => correctly handles string type event', () => {
      // Arrange
      const events: EventsMap = { EVENT1: stringsT.type };
      const elseSpy = vi.fn().mockReturnValue('else result');

      const fnMap: FnMapR<any, any, any, string> = {
        EVENT1: () => 'event1 result',
        else: elseSpy,
      };

      // Act
      const reducedFn = reduceFnMapReduced(fnMap, ...Object.keys(events));
      const result = reducedFn({
        context: {},
        event: INIT_EVENT,
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      // Assert
      test('#01 => elseSpy was called correctly', () =>
        expect(elseSpy).toHaveBeenCalledWith({
          context: {},
          event: INIT_EVENT,
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#02 => result is "else result"', () =>
        expect(result).toBe('else result'));
    });

    describe('#03 => correctly executes mapped event functions', () => {
      // Arrange
      const events: EventsMap = {
        EVENT1: stringsT.type,
        EVENT2: numbersT.type,
      };
      const event1Fn = vi.fn().mockReturnValue('event1 result');
      const event2Fn = vi.fn().mockReturnValue('event2 result');
      const elseFn = vi.fn().mockReturnValue('else result');

      const fnMap: FnMapR<any, any, any, string> = {
        EVENT1: event1Fn,
        EVENT2: event2Fn,
        else: elseFn,
      };

      // Act
      const reducedFn = reduceFnMapReduced(fnMap, ...Object.keys(events));

      const result1 = reducedFn({
        context: {},
        event: { type: 'EVENT1', payload: 'test payload' },
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      const result2 = reducedFn({
        context: {},
        event: { type: 'EVENT2', payload: 123 },
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      const result3 = reducedFn({
        context: {},
        event: { type: 'UNKNOWN', payload: null },
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      // Assert
      test('#01 => event1Fn was called with correct payload', () =>
        expect(event1Fn).toHaveBeenCalledWith({
          context: {},
          payload: 'test payload',
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#02 => event2Fn was called with correct payload', () =>
        expect(event2Fn).toHaveBeenCalledWith({
          context: {},
          payload: 123,
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#03 => elseFn was called with full event for unknown event', () =>
        expect(elseFn).toHaveBeenCalledWith({
          context: {},
          event: { type: 'UNKNOWN', payload: null },
          status: 'active' as any,
          value: 'test',
          tags: [],
        }));

      test('#04 => result1 is "event1 result"', () =>
        expect(result1).toBe('event1 result'));
      test('#05 => result2 is "event2 result"', () =>
        expect(result2).toBe('event2 result'));
      test('#06 => result3 is "else result"', () =>
        expect(result3).toBe('else result'));
    });

    test('#04 => uses nothing as default else function', () => {
      // Arrange
      const events: EventsMap = { EVENT1: stringsT.type };

      const fnMap: FnMapR<any, any, any, any> = {
        EVENT1: () => 'event1 result',
      };

      // Act
      const reducedFn = reduceFnMapReduced(fnMap, ...Object.keys(events));
      const result = reducedFn({
        context: {},
        event: { type: 'UNKNOWN', payload: null },
        status: 'active' as any,
        value: 'test',
        tags: [],
      });

      // Assert
      expect(result).toBe('nothing');
    });
  });

  describe('#03 => reduceFnMapFilterArray', () => {
    describe('#01 => returns function directly if it is already a function', () => {
      const directFn = (item: number, index: number) => item > 2 && index > 0;
      const result = reduceFnMapFilterArray(directFn, 'EVENT1');

      test('#01 => result is directFn', () => expect(result).toBe(directFn));

      test('#02 => evaluates correctly', () => {
        expect(
          result(3, 1, {
            event: { type: 'EVENT1', payload: {} },
            context: {},
            pContext: {},
            status: 'active' as any,
            value: 'test',
            tags: [],
          }),
        ).toBe(true);
        expect(
          result(1, 0, {
            event: { type: 'EVENT1', payload: {} },
            context: {},
            pContext: {},
            status: 'active' as any,
            value: 'test',
            tags: [],
          }),
        ).toBe(false);
      });
    });

    describe('#02 => correctly executes mapped event filter functions', () => {
      const events: EventsMap = {
        FILTER_EVEN: numbersT.type,
        FILTER_ODD: numbersT.type,
      };

      const fnMap: FnMapFilterArray<any, any, any, any, number> = {
        FILTER_EVEN: (num, idx, state) => {
          expect(state).toHaveProperty('context');
          expect(state).toHaveProperty('payload');
          return num % 2 === 0;
        },
        FILTER_ODD: num => num % 2 !== 0,
        else: num => num > 5,
      };

      const reducedFn = reduceFnMapFilterArray(fnMap, ...Object.keys(events));

      test('#01 => filter even event', () => {
        const state = {
          event: { type: 'FILTER_EVEN', payload: { divisor: 2 } },
          context: { test: true },
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        };
        expect(reducedFn(2, 0, state)).toBe(true);
        expect(reducedFn(3, 1, state)).toBe(false);
      });

      test('#02 => filter odd event', () => {
        const state = {
          event: { type: 'FILTER_ODD', payload: {} },
          context: {},
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        };
        expect(reducedFn(3, 0, state)).toBe(true);
        expect(reducedFn(2, 1, state)).toBe(false);
      });

      test('#03 => else fallback on unknown event', () => {
        const state = {
          event: { type: 'UNKNOWN', payload: {} },
          context: {},
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        };
        expect(reducedFn(6, 0, state)).toBe(true);
        expect(reducedFn(4, 1, state)).toBe(false);
      });

      test('#04 => string event fallback', () => {
        const state = {
          event: 'FILTER_EVEN',
          context: {},
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        };
        expect(reducedFn(2, 0, state)).toBe(true);
        expect(reducedFn(3, 1, state)).toBe(false);
      });
    });
  });

  describe('#04 => reduceFnMapFilterObject', () => {
    describe('#01 => returns function directly if it is already a function', () => {
      const directFn = (item: number) => item >= 80;
      const result = reduceFnMapFilterObject(directFn, 'EVENT1');

      test('#01 => result is directFn', () => expect(result).toBe(directFn));

      test('#02 => evaluates correctly', () => {
        expect(
          result(90, {
            event: { type: 'EVENT1', payload: {} },
            context: {},
            pContext: {},
            status: 'active' as any,
            value: 'test',
            tags: [],
          }),
        ).toBe(true);
        expect(
          result(50, {
            event: { type: 'EVENT1', payload: {} },
            context: {},
            pContext: {},
            status: 'active' as any,
            value: 'test',
            tags: [],
          }),
        ).toBe(false);
      });
    });

    describe('#02 => correctly executes mapped event filter functions', () => {
      const events: EventsMap = {
        FILTER_HIGH: numbersT.type,
      };

      const fnMap: FnMapFilterObject<any, any, any, any, number> = {
        FILTER_HIGH: (score, state) => {
          expect(state).toHaveProperty('context');
          expect(state).toHaveProperty('payload');
          return score >= 80;
        },
        else: score => score === 100,
      };

      const reducedFn = reduceFnMapFilterObject(fnMap, ...Object.keys(events));

      test('#01 => filter high event', () => {
        const state = {
          event: { type: 'FILTER_HIGH', payload: {} },
          context: { test: true },
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        };
        expect(reducedFn(85, state)).toBe(true);
        expect(reducedFn(70, state)).toBe(false);
      });

      test('#02 => else fallback on unknown event', () => {
        const state = {
          event: { type: 'UNKNOWN', payload: {} },
          context: {},
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        };
        expect(reducedFn(100, state)).toBe(true);
        expect(reducedFn(85, state)).toBe(false);
      });

      test('#03 => string event fallback', () => {
        const state = {
          event: 'FILTER_HIGH',
          context: {},
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        };
        expect(reducedFn(90, state)).toBe(true);
        expect(reducedFn(60, state)).toBe(false);
      });
    });
  });
});
