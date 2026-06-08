import {
  INIT_EVENT,
  MAX_EXCEEDED_EVENT_TYPE,
  type EventsMap,
} from '#events';
import { numbersT, stringsT } from '@bemedev/app-utils-bemedev';
import type { FnMap, FnMapR } from '~types';
import { reduceFnMap, reduceFnMapReduced } from '../../utils/reduceFnMap';

describe('reduceFnMap tests', () => {
  describe('#02 => reduceFnMap', () => {
    test('#01 => returns function directly if it is already a function', () => {
      // Arrange
      const events: EventsMap = {};
      const directFn = () => 'result';

      // Act
      const result = reduceFnMap(directFn, ...Object.keys(events));

      // Assert
      expect(result).toBe(directFn);
      expect(
        result({
          event: { type: INIT_EVENT, payload: {} },
          context: {},
          pContext: {},
          status: 'active' as any,
          value: 'test',
          tags: [],
        }),
      ).toBe('result');
    });

    test('#02 => correctly handles string type event', () => {
      // Arrange
      const events: EventsMap = {
        EVENT1: stringsT.type,
      };
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
      expect(elseSpy).toHaveBeenCalledWith({
        event: INIT_EVENT,
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      expect(result).toBe('else result');
    });

    test('#03 => uses appropriate function based on event type', () => {
      // Arrange
      const events: EventsMap = {
        EVENT1: stringsT.type,
        EVENT2: { data: numbersT.type },
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
        event: { type: 'EVENT1', payload: 'test' },
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      const result2 = reducedFn({
        event: { type: 'EVENT2', payload: { data: 42 } },
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
      expect(event1Fn).toHaveBeenCalledWith({
        payload: 'test',
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      expect(event2Fn).toHaveBeenCalledWith({
        payload: { data: 42 },
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      expect(elseFn).toHaveBeenCalledWith({
        event: { type: 'UNKNOWN', payload: null },
        context: {},
        pContext: {},
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      expect(result1).toBe('event1 result');
      expect(result2).toBe('event2 result');
      expect(result3).toBe('else result');
    });

    test('#04 => uses nothing as default else function', () => {
      // Arrange
      const events: EventsMap = {
        EVENT1: stringsT.type,
      };

      const fnMap: FnMap<any, any, any, any, any> = {
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
  });

  describe('#03 => reduceFnMapReduced', () => {
    test('#01 => returns function directly if it is already a function', () => {
      // Arrange
      const events: EventsMap = {};
      const directFn = () => 'result';

      // Act
      const result = reduceFnMapReduced(directFn, ...Object.keys(events));

      // Assert
      expect(result).toBe(directFn);
      expect(
        result({
          context: {},
          event: { type: MAX_EXCEEDED_EVENT_TYPE, payload: {} },
          status: 'active' as any,
          value: 'test',
          tags: [],
        }),
      ).toBe('result');
    });

    test('#02 => correctly handles string type event', () => {
      // Arrange
      const events: EventsMap = {
        EVENT1: stringsT.type,
      };
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
      expect(elseSpy).toHaveBeenCalledWith({
        context: {},
        event: INIT_EVENT,
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      expect(result).toBe('else result');
    });

    test('#03 => uses appropriate function based on event type', () => {
      // Arrange
      const events: EventsMap = {
        EVENT1: stringsT.type,
        EVENT2: { data: numbersT.type },
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
        event: { type: 'EVENT1', payload: 'test' },
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      const result2 = reducedFn({
        context: {},
        event: { type: 'EVENT2', payload: { data: 42 } },
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
      expect(event1Fn).toHaveBeenCalledWith({
        context: {},
        payload: 'test',
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      expect(event2Fn).toHaveBeenCalledWith({
        context: {},
        payload: { data: 42 },
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      expect(elseFn).toHaveBeenCalledWith({
        context: {},
        event: { type: 'UNKNOWN', payload: null },
        status: 'active' as any,
        value: 'test',
        tags: [],
      });
      expect(result1).toBe('event1 result');
      expect(result2).toBe('event2 result');
      expect(result3).toBe('else result');
    });

    test('#04 => uses nothing as default else function', () => {
      // Arrange
      const events: EventsMap = {
        EVENT1: stringsT.type,
      };

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
});
