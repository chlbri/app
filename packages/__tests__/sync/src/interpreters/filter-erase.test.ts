import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import _machine1 from './filter-erase.1.machine';
import _machine2 from './filter-erase.2.machine';
import _machine3 from './filter-erase.3.machine';
import _machine4 from './filter-erase.4.machine';
import _machine5 from './filter-erase.5.machine';
import _machine6 from './filter-erase.6.machine';
import _machine7 from './filter-erase.7.machine';
import _machine8 from './filter-erase.8.machine';

describe('Filter and Erase actions', () => {
  describe('#01 => Filter action', () => {
    describe('#01 => Filter array of numbers', () => {
      const machine = _machine1;

      const service = interpret(machine, { context: { numbers: [] } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('state1', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            addNumbers: assign('numbers', {
              ADD: ({ payload }) => payload.values,
            }),
            filterEven: filter('numbers', num => num % 2 === 0),
          },
        }));
      });

      test('#04 => Add numbers', () => {
        service.send({
          type: 'ADD',
          payload: { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        });
      });

      test('#05 => Check numbers', () => {
        expect(service.select('numbers')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      test(...useSend('FILTER', 6));
      test(...useValue('state2', 7));

      test('#08 => Check filtered numbers (only even)', () => {
        expect(service.select('numbers')).toEqual([2, 4, 6, 8, 10]);
      });
    });

    describe('#02 => Filter array of objects', () => {
      const machine = _machine2;

      const service = interpret(machine, { context: { people: [] } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            addPeople: assign('people', {
              ADD_PEOPLE: ({ payload }) => payload.people,
            }),
            filterActive: filter('people', ({ active }) => active),
          },
        }));
      });

      test('#04 => Add people', () => {
        service.send({
          type: 'ADD_PEOPLE',
          payload: {
            people: [
              { name: 'Alice', age: 30, active: true },
              { name: 'Bob', age: 25, active: false },
              { name: 'Charlie', age: 35, active: true },
              { name: 'David', age: 28, active: false },
              { name: 'Eve', age: 32, active: true },
            ],
          },
        });
      });

      test('#05 => Check people', () => {
        expect(service.select('people')).toHaveLength(5);
      });

      test(...useSend('FILTER_ACTIVE', 6));
      test(...useValue('filtered', 7));

      test('#08 => Check filtered people (only active)', () => {
        const people = service.select('people');
        expect(people).toHaveLength(3);
        expect(people?.every(p => p.active)).toBe(true);
        expect(people?.map(p => p.name)).toEqual(['Alice', 'Charlie', 'Eve']);
      });
    });

    describe('#03 => Filter object properties', () => {
      const machine = _machine3;

      const service = interpret(machine, { context: { scores: {} } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            setScores: assign('scores', {
              SET_SCORES: ({ payload }) => {
                return payload.scores;
              },
            }),
            filterHighScores: filter('scores', score => score >= 80),
          },
        }));
      });

      test(
        ...useSend({
          type: 'SET_SCORES',
          payload: {
            scores: { user1: 95, user2: 60, user3: 85, user4: 45, user5: 90 },
          },
        }),
      );

      test('#04 => Check scores', () => {
        expect(Object.keys(service.select('scores') ?? {}).length).toBe(5);
      });

      test(...useSend('FILTER_HIGH_SCORES', 5));

      test('#06 => Check filtered scores (>= 80)', () => {
        const scores = service.select('scores');

        expect(scores).toEqual({ user1: 95, user3: 85, user5: 90 });
      });
    });

    describe('#04 => Filter array with function map (FnMap)', () => {
      const machine = _machine1;

      const service = interpret(machine, { context: { numbers: [] } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('state1', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            addNumbers: assign('numbers', {
              ADD: ({ payload }) => payload.values,
            }),
            filterEven: filter('numbers', {
              FILTER: (num, index, state) => {
                expect(state).toHaveProperty('context');
                return num % 2 === 0;
              },
            }),
          },
        }));
      });

      test('#04 => Add numbers', () => {
        service.send({
          type: 'ADD',
          payload: { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        });
      });

      test('#05 => Check numbers', () => {
        expect(service.select('numbers')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      test(...useSend('FILTER', 6));
      test(...useValue('state2', 7));

      test('#08 => Check filtered numbers (only even)', () => {
        expect(service.select('numbers')).toEqual([2, 4, 6, 8, 10]);
      });
    });

    describe('#05 => Filter object with function map (FnMap)', () => {
      const machine = _machine3;

      const service = interpret(machine, { context: { scores: {} } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            setScores: assign('scores', {
              SET_SCORES: ({ payload }) => payload.scores,
            }),
            filterHighScores: filter('scores', {
              FILTER_HIGH_SCORES: (score, state) => {
                expect(state).toHaveProperty('payload');
                return score >= 80;
              },
            }),
          },
        }));
      });

      test(
        ...useSend({
          type: 'SET_SCORES',
          payload: {
            scores: { user1: 95, user2: 60, user3: 85, user4: 45, user5: 90 },
          },
        }),
      );

      test('#04 => Check scores', () => {
        expect(Object.keys(service.select('scores') ?? {}).length).toBe(5);
      });

      test(...useSend('FILTER_HIGH_SCORES', 5));

      test('#06 => Check filtered scores (>= 80)', () => {
        const scores = service.select('scores');

        expect(scores).toEqual({ user1: 95, user3: 85, user5: 90 });
      });
    });

    describe('#06 => Filter array with function map with else fallback', () => {
      const machine = _machine1;

      const service = interpret(machine, { context: { numbers: [] } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('state1', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            addNumbers: assign('numbers', {
              ADD: ({ payload }) => payload.values,
            }),
            filterEven: filter('numbers', {
              RESET: num => num % 2 !== 0,
              else: num => num % 2 === 0,
            }),
          },
        }));
      });

      test('#04 => Add numbers', () => {
        service.send({
          type: 'ADD',
          payload: { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        });
      });

      test('#05 => Check numbers', () => {
        expect(service.select('numbers')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      test(...useSend('FILTER', 6));
      test(...useValue('state2', 7));

      test('#08 => Check filtered numbers via else (only even)', () => {
        expect(service.select('numbers')).toEqual([2, 4, 6, 8, 10]);
      });
    });

    describe('#07 => Filter array with function map without else (fallback to nothing)', () => {
      const machine = _machine1;

      const service = interpret(machine, { context: { numbers: [] } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('state1', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            addNumbers: assign('numbers', {
              ADD: ({ payload }) => payload.values,
            }),
            filterEven: filter('numbers', { RESET: num => num % 2 !== 0 }),
          },
        }));
      });

      test('#04 => Add numbers', () => {
        service.send({
          type: 'ADD',
          payload: { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        });
      });

      test('#05 => Check numbers', () => {
        expect(service.select('numbers')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });

      test(...useSend('FILTER', 6));
      test(...useValue('state2', 7));

      test('#08 => Check numbers kept via nothing (all preserved)', () => {
        expect(service.select('numbers')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    });

    describe('#08 => Filter object with function map with else fallback', () => {
      const machine = _machine3;

      const service = interpret(machine, { context: { scores: {} } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            setScores: assign('scores', {
              SET_SCORES: ({ payload }) => payload.scores,
            }),
            filterHighScores: filter('scores', {
              SET_SCORES: score => score < 50,
              else: score => score >= 80,
            }),
          },
        }));
      });

      test(
        ...useSend({
          type: 'SET_SCORES',
          payload: {
            scores: { user1: 95, user2: 60, user3: 85, user4: 45, user5: 90 },
          },
        }),
      );

      test('#04 => Check scores', () => {
        expect(Object.keys(service.select('scores') ?? {}).length).toBe(5);
      });

      test(...useSend('FILTER_HIGH_SCORES', 5));

      test('#06 => Check filtered scores via else (>= 80)', () => {
        const scores = service.select('scores');
        expect(scores).toEqual({ user1: 95, user3: 85, user5: 90 });
      });
    });

    describe('#09 => Filter object with function map without else (fallback to nothing)', () => {
      const machine = _machine3;

      const service = interpret(machine, { context: { scores: {} } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, filter }) => ({
          actions: {
            setScores: assign('scores', {
              SET_SCORES: ({ payload }) => payload.scores,
            }),
            filterHighScores: filter('scores', {
              SET_SCORES: score => score < 50,
            }),
          },
        }));
      });

      test(
        ...useSend({
          type: 'SET_SCORES',
          payload: {
            scores: { user1: 95, user2: 60, user3: 85, user4: 45, user5: 90 },
          },
        }),
      );

      test('#04 => Check scores', () => {
        expect(Object.keys(service.select('scores') ?? {}).length).toBe(5);
      });

      test(...useSend('FILTER_HIGH_SCORES', 5));

      test('#06 => Check scores kept via nothing (all preserved)', () => {
        const scores = service.select('scores');
        expect(scores).toEqual({
          user1: 95,
          user2: 60,
          user3: 85,
          user4: 45,
          user5: 90,
        });
      });
    });

    describe('#10 => Filter array on lifecycle events with map and else', () => {
      const machine = _machine7;

      const service = interpret(machine, {
        context: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test('#00 => Add actions', () => {
        service.addOptions(({ filter }) => ({
          actions: {
            filterInit: filter('numbers', { else: num => num <= 8 }),
            filterAlways: filter('numbers', { else: num => num <= 6 }),
          },
        }));
      });

      test(...start(1));
      test(...useValue('init_state', 2));

      test('#03 => Check filtered numbers after init entry', () => {
        expect(service.select('numbers')).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      });

      test(...useSend('TRIGGER_ALWAYS', 4));
      test(...useValue('final_state', 5));

      test('#06 => Check filtered numbers after always transition', () => {
        expect(service.select('numbers')).toEqual([1, 2, 3, 4, 5, 6]);
      });
    });

    describe('#11 => Filter array on lifecycle events with map without else', () => {
      const machine = _machine7;

      const service = interpret(machine, { context: { numbers: [1, 2, 3, 4] } });

      const { useStateValue: useValue, start } = constructTests(service);

      test('#00 => Add actions', () => {
        service.addOptions(({ filter }) => ({
          actions: {
            filterInit: filter('numbers', {
              TRIGGER_ALWAYS: num => num > 0,
            }),
          },
        }));
      });

      test(...start(1));
      test(...useValue('init_state', 2));

      test('#03 => Check numbers kept without else on INIT_EVENT', () => {
        expect(service.select('numbers')).toEqual([1, 2, 3, 4]);
      });
    });

    describe('#12 => Filter object on lifecycle events with map and else', () => {
      const machine = _machine8;

      const service = interpret(machine, {
        context: { scores: { user1: 95, user2: 60, user3: 85 } },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test('#00 => Add actions', () => {
        service.addOptions(({ filter }) => ({
          actions: {
            filterInit: filter('scores', { else: score => score >= 70 }),
            filterAlways: filter('scores', { else: score => score >= 90 }),
          },
        }));
      });

      test(...start(1));
      test(...useValue('init_state', 2));

      test('#03 => Check filtered scores after init entry', () => {
        expect(service.select('scores')).toEqual({ user1: 95, user3: 85 });
      });

      test(...useSend('TRIGGER_ALWAYS', 4));
      test(...useValue('final_state', 5));

      test('#06 => Check filtered scores after always transition', () => {
        expect(service.select('scores')).toEqual({ user1: 95 });
      });
    });

    describe('#13 => Filter object on lifecycle events with map without else', () => {
      const machine = _machine8;

      const service = interpret(machine, {
        context: { scores: { user1: 95, user2: 60, user3: 85 } },
      });

      const { useStateValue: useValue, start } = constructTests(service);

      test('#00 => Add actions', () => {
        service.addOptions(({ filter }) => ({
          actions: {
            filterInit: filter('scores', {
              TRIGGER_ALWAYS: score => score > 0,
            }),
          },
        }));
      });

      test(...start(1));
      test(...useValue('init_state', 2));

      test('#03 => Check scores kept without else on INIT_EVENT', () => {
        expect(service.select('scores')).toEqual({
          user1: 95,
          user2: 60,
          user3: 85,
        });
      });
    });


    describe('#14 => Filter array with string event (reduceFnMapFilterArray check5)', () => {
      const machine = _machine1;

      describe('#01 => String event matching mapped key', () => {
        const { actions } = machine.createOptions(({ filter }) => ({
          actions: {
            filterEven: filter('numbers', {
              FILTER: num => num > 5,
              else: num => num <= 3,
            }),
          },
        }));

        const state = {
          context: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
          event: 'FILTER',
        } as any;

        const result = actions?.filterEven?.(state);

        test('#01 => is an object', () => expect(typeof result).toBe('object'));

        test('#02 => filters numbers matching key condition (> 5)', () => {
          expect(result).toEqual({
            mergers: [
              {
                key: 'numbers',
                source: { numbers: [6, 7, 8, 9, 10] },
              },
            ],
          });
        });
      });

      describe('#02 => String event matching mapped key but handler is undefined in map', () => {
        const { actions } = machine.createOptions(({ filter }) => ({
          actions: {
            filterEven: filter('numbers', {
              FILTER: undefined as any,
              else: num => num % 2 === 0,
            }),
          },
        }));

        const state = {
          context: { numbers: [1, 2, 3, 4, 5, 6] },
          event: 'FILTER',
        } as any;

        const result = actions?.filterEven?.(state);

        test('#01 => is an object', () => expect(typeof result).toBe('object'));

        test('#02 => filters numbers via else fallback (even numbers)', () => {
          expect(result).toEqual({
            mergers: [
              {
                key: 'numbers',
                source: { numbers: [2, 4, 6] },
              },
            ],
          });
        });
      });

      describe('#03 => Unmapped string event with else fallback', () => {
        const { actions } = machine.createOptions(({ filter }) => ({
          actions: {
            filterEven: filter('numbers', {
              FILTER: num => num > 5,
              else: num => num <= 3,
            }),
          },
        }));

        const state = {
          context: { numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
          event: 'UNKNOWN_EVENT',
        } as any;

        const result = actions?.filterEven?.(state);

        test('#01 => is an object', () => expect(typeof result).toBe('object'));

        test('#02 => filters numbers via else condition (<= 3)', () => {
          expect(result).toEqual({
            mergers: [
              {
                key: 'numbers',
                source: { numbers: [1, 2, 3] },
              },
            ],
          });
        });
      });

      describe('#04 => Unmapped string event without else (fallback to nothing)', () => {
        const { actions } = machine.createOptions(({ filter }) => ({
          actions: {
            filterEven: filter('numbers', { FILTER: num => num > 5 }),
          },
        }));

        const state = {
          context: { numbers: [1, 2, 3, 4, 5] },
          event: 'UNKNOWN_EVENT',
        } as any;

        const result = actions?.filterEven?.(state);

        test('#01 => is an object', () => expect(typeof result).toBe('object'));

        test('#02 => keeps numbers when falling back to nothing', () => {
          expect(result).toEqual({
            mergers: [
              {
                key: 'numbers',
                source: { numbers: [1, 2, 3, 4, 5] },
              },
            ],
          });
        });
      });
    });

    describe('#15 => Filter object with string event (reduceFnMapFilterObject check5)', () => {
      const machine = _machine3;

      describe('#01 => String event matching mapped key', () => {
        const { actions } = machine.createOptions(({ filter }) => ({
          actions: {
            filterHighScores: filter('scores', {
              FILTER_HIGH_SCORES: score => score >= 80,
              else: score => score < 50,
            }),
          },
        }));

        const state = {
          context: { scores: { math: 90, physics: 75, history: 85, english: 45 } },
          event: 'FILTER_HIGH_SCORES',
        } as any;

        const result = actions?.filterHighScores?.(state);

        test('#01 => is an object', () => expect(typeof result).toBe('object'));

        test('#02 => filters scores matching key condition (>= 80)', () => {
          expect(result).toEqual({
            mergers: [
              {
                key: 'scores',
                source: { scores: { math: 90, history: 85 } },
              },
            ],
          });
        });
      });

      describe('#02 => String event matching mapped key but handler is undefined in map', () => {
        const { actions } = machine.createOptions(({ filter }) => ({
          actions: {
            filterHighScores: filter('scores', {
              FILTER_HIGH_SCORES: undefined as any,
              else: score => score >= 70,
            }),
          },
        }));

        const state = {
          context: { scores: { math: 90, physics: 75, history: 60 } },
          event: 'FILTER_HIGH_SCORES',
        } as any;

        const result = actions?.filterHighScores?.(state);

        test('#01 => is an object', () => expect(typeof result).toBe('object'));

        test('#02 => filters scores via else fallback (>= 70)', () => {
          expect(result).toEqual({
            mergers: [
              {
                key: 'scores',
                source: { scores: { math: 90, physics: 75 } },
              },
            ],
          });
        });
      });

      describe('#03 => Unmapped string event with else fallback', () => {
        const { actions } = machine.createOptions(({ filter }) => ({
          actions: {
            filterHighScores: filter('scores', {
              FILTER_HIGH_SCORES: score => score >= 80,
              else: score => score < 50,
            }),
          },
        }));

        const state = {
          context: { scores: { math: 90, physics: 75, history: 85, english: 45 } },
          event: 'UNKNOWN_EVENT',
        } as any;

        const result = actions?.filterHighScores?.(state);

        test('#01 => is an object', () => expect(typeof result).toBe('object'));

        test('#02 => filters scores via else condition (< 50)', () => {
          expect(result).toEqual({
            mergers: [
              {
                key: 'scores',
                source: { scores: { english: 45 } },
              },
            ],
          });
        });
      });

      describe('#04 => Unmapped string event without else (fallback to nothing)', () => {
        const { actions } = machine.createOptions(({ filter }) => ({
          actions: {
            filterHighScores: filter('scores', {
              FILTER_HIGH_SCORES: score => score >= 80,
            }),
          },
        }));

        const state = {
          context: { scores: { math: 90, physics: 75 } },
          event: 'UNKNOWN_EVENT',
        } as any;

        const result = actions?.filterHighScores?.(state);

        test('#01 => is an object', () => expect(typeof result).toBe('object'));

        test('#02 => keeps all scores when falling back to nothing', () => {
          expect(result).toEqual({
            mergers: [
              {
                key: 'scores',
                source: { scores: { math: 90, physics: 75 } },
              },
            ],
          });
        });
      });
    });
  });

  describe('#02 => Erase action', () => {
    describe('#01 => Erase single context property', () => {
      const machine = _machine4;

      const service = interpret(machine, { context: { data: 42 } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, erase }) => ({
          actions: {
            setName: assign('name', {
              SET_NAME: ({ payload }) => payload.name,
            }),
            clearName: erase('name'),
          },
        }));
      });

      test(...useSend({ type: 'SET_NAME', payload: { name: 'John Doe' } }, 3));

      test('#04 => Check name', () => {
        expect(service.select('name')).toBe('John Doe');
      });




      test(...useSend('CLEAR_NAME', 5));

      test('#06 => Check name is undefined', () => {
        expect(service.select('name')).toBeUndefined();
      });
    });

    describe('#02 => Erase nested property', () => {
      const machine = _machine5;

      const service = interpret(machine, { context: { user: { name: '' } } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, erase }) => ({
          actions: {
            setUser: assign('user', {
              SET_USER: ({ payload }) => ({
                name: payload.name,
                email: payload.email,
              }),
            }),
            clearEmail: erase('user.email'),
          },
        }));
      });

      test(
        ...useSend(
          {
            type: 'SET_USER',
            payload: { name: 'Jane Doe', email: 'jane@example.com' },
          },
          3,
        ),
      );

      test('#04 => Check user name', () => {
        expect(service.select('user')?.name).toBe('Jane Doe');
      });

      test('#05 => Check user email', () => {
        expect(service.select('user')?.email).toBe('jane@example.com');
      });

      test(...useSend('CLEAR_EMAIL', 6));

      test('#07 => Check name still exists', () => {
        expect(service.select('user')?.name).toBe('Jane Doe');
      });

      test('#08 => Check email is undefined', () => {
        expect(service.select('user')?.email).toBeUndefined();
      });
    });

    describe('#03 => Erase multiple properties with batch', () => {
      const machine = _machine6;

      const service = interpret(machine, { context: {} });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, erase, batch }) => ({
          actions: {
            setData: assign({ SET_DATA: ({ payload }) => payload }),
            clearAll: batch(
              erase('name'),
              erase('email'),
              erase('age'),
            ),
          },
        }));
      });

      test(
        ...useSend(
          {
            type: 'SET_DATA',
            payload: { name: 'Alice', email: 'alice@example.com', age: 30 },
          },
          4,
        ),
      );

      test('#05 => Check name', () => {
        expect(service.select('name')).toBe('Alice');
      });

      test('#06 => Check email', () => {
        expect(service.select('email')).toBe('alice@example.com');
      });

      test('#07 => Check age', () => {
        expect(service.select('age')).toBe(30);
      });

      test(...useSend('CLEAR_ALL', 8));
      test(...useValue('cleared', 9));

      test('#10 => Check name is undefined', () => {
        expect(service.select('name')).toBeUndefined();
      });

      test('#11 => Check email is undefined', () => {
        expect(service.select('email')).toBeUndefined();
      });

      test('#12 => Check age is undefined', () => {
        expect(service.select('age')).toBeUndefined();
      });
    });

    describe('#04 => Erase multiple properties (action result)', () => {
      const machine = _machine6;

      const { actions } = machine.createOptions(({ erase }) => ({
        actions: { clearAll: erase('name', 'email', 'age') },
      }));

      const state = {
        context: { name: 'Alice', email: 'alice@example.com', age: 30 },
      } as any;

      const result = actions?.clearAll?.(state);

      test('#01 => is an object', () => expect(typeof result).toBe('object'));

      test('#02 => returns mergers for all specified keys', () => {
        expect(result).toEqual({
          mergers: [
            { key: 'name', source: { name: undefined } },
            { key: 'email', source: { email: undefined } },
            { key: 'age', source: { age: undefined } },
          ],
        });
      });
    });

    describe('#05 => Erase multiple properties directly with erase', () => {
      const machine = _machine6;

      const service = interpret(machine, { context: {} });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign, erase }) => ({
          actions: {
            setData: assign({ SET_DATA: ({ payload }) => payload }),
            clearAll: erase('name', 'email', 'age'),
          },
        }));
      });

      test(
        ...useSend(
          {
            type: 'SET_DATA',
            payload: { name: 'Alice', email: 'alice@example.com', age: 30 },
          },
          4,
        ),
      );

      test('#05 => Check name', () => {
        expect(service.select('name')).toBe('Alice');
      });

      test('#06 => Check email', () => {
        expect(service.select('email')).toBe('alice@example.com');
      });

      test('#07 => Check age', () => {
        expect(service.select('age')).toBe(30);
      });

      test(...useSend('CLEAR_ALL', 8));
      test(...useValue('cleared', 9));

      test('#10 => Check name is undefined', () => {
        expect(service.select('name')).toBeUndefined();
      });

      test('#11 => Check email is undefined', () => {
        expect(service.select('email')).toBeUndefined();
      });

      test('#12 => Check age is undefined', () => {
        expect(service.select('age')).toBeUndefined();
      });
    });
  });
});

