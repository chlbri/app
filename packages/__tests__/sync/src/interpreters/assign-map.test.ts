import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import _machine1 from './assign-map.1.machine';
import _machine2 from './assign-map.2.machine';
import _machine3 from './assign-map.3.machine';
import _machine4 from './assign-map.4.machine';
import _machine5 from './assign-map.5.machine';

describe('reduceFnMap and reduceFnMapReduced through machine options', () => {
  describe('#01 => Property assign (reduceFnMap)', () => {
    describe('#01 => Direct function assignment', () => {
      const machine = _machine1;

      const service = interpret(machine, {
        context: { value: 'initial', count: 0 },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            setValue: assign('context.value', ({ event }) => {
              expect(event).toHaveProperty('payload');
              return (event as any).payload.val;
            }),
          },
        }));
      });

      test(...useSend({ type: 'SET_VALUE', payload: { val: 'updated_direct' } }, 4));

      test('#05 => Check updated value', () => {
        expect(service.select('value')).toBe('updated_direct');
      });
    });

    describe('#02 => Mapped event function assignment with payload and context', () => {
      const machine = _machine1;

      const service = interpret(machine, {
        context: { value: 'initial', count: 0 },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            setValue: assign('context.value', {
              SET_VALUE: ({ payload, context }) => {
                expect(context).toHaveProperty('value');
                return payload.val;
              },
            }),
            setCount: assign('context.count', {
              SET_COUNT: ({ payload }) => payload.num,
            }),
          },
        }));
      });

      test(...useSend({ type: 'SET_VALUE', payload: { val: 'mapped_val' } }, 4));

      test('#05 => Check updated value', () => {
        expect(service.select('value')).toBe('mapped_val');
      });

      test(...useSend({ type: 'SET_COUNT', payload: { num: 42 } }, 6));

      test('#07 => Check updated count', () => {
        expect(service.select('count')).toBe(42);
      });
    });

    describe('#03 => Unmapped event falls back to else function', () => {
      const machine = _machine1;

      const service = interpret(machine, {
        context: { value: 'initial', count: 0 },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            handleUnknown: assign('context.value', {
              SET_VALUE: ({ payload }) => payload.val,
              else: ({ event }) => `fallback_${(event as any).type}`,
            }),
          },
        }));
      });

      test(...useSend('UNKNOWN_EVENT', 4));

      test('#05 => Check value from else fallback', () => {
        expect(service.select('value')).toBe('fallback_UNKNOWN_EVENT');
      });
    });

    describe('#04 => Event with undefined handler in map falls back to else', () => {
      const machine = _machine1;

      const service = interpret(machine, {
        context: { value: 'initial', count: 0 },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            reset: assign('context.value', {
              SET_VALUE: ({ payload }) => payload.val,
              else: () => 'reset_via_else',
            }),
          },
        }));
      });

      test(...useSend('RESET', 4));

      test('#05 => Check value from else when handler undefined in map', () => {
        expect(service.select('value')).toBe('reset_via_else');
      });
    });

    describe('#05 => Unmapped event without else falls back to nothing', () => {
      const machine = _machine1;

      const service = interpret(machine, {
        context: { value: 'initial', count: 0 },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            handleUnknown: assign('context.value', {
              SET_VALUE: ({ payload }) => payload.val,
            }),
          },
        }));
      });

      test(...useSend('UNKNOWN_EVENT', 4));

      test('#05 => Check value unchanged when nothing returned', () => {
        expect(service.select('value')).toBe('nothing');
      });
    });
  });

  describe('#02 => Root assign (reduceFnMapReduced)', () => {
    describe('#01 => Direct function assignment', () => {
      const machine = _machine2;

      const service = interpret(machine, {
        context: { name: 'John', age: 30, role: 'admin' },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            updateAll: assign(
              ['context.name', 'context.age', 'context.role'],
              ({ event }) => [
                (event as any).payload.name,
                (event as any).payload.age,
                (event as any).payload.role,
              ],
            ),
          },
        }));
      });

      test(
        ...useSend(
          { type: 'UPDATE_ALL', payload: { name: 'Jane', age: 25, role: 'user' } },
          4,
        ),
      );

      test('#05 => Check updated context name', () => {
        expect(service.select('name')).toBe('Jane');
      });

      test('#06 => Check updated context age', () => {
        expect(service.select('age')).toBe(25);
      });

      test('#07 => Check updated context role', () => {
        expect(service.select('role')).toBe('user');
      });
    });

    describe('#02 => Mapped event function assignment with payload and context', () => {
      const machine = _machine2;

      const service = interpret(machine, {
        context: { name: 'John', age: 30, role: 'admin' },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            updateAll: assign(['context.name', 'context.age', 'context.role'], {
              UPDATE_ALL: ({ payload, context }) => {
                expect(context).toHaveProperty('name');
                return [payload.name, payload.age, payload.role];
              },
            }),
            partialUpdate: assign('context.name', {
              PARTIAL_UPDATE: ({ payload }) => payload.name,
            }),
          },
        }));
      });

      test(
        ...useSend(
          {
            type: 'UPDATE_ALL',
            payload: { name: 'Alice', age: 28, role: 'manager' },
          },
          4,
        ),
      );

      test('#05 => Check updated context from UPDATE_ALL', () => {
        expect(service.select('name')).toBe('Alice');
        expect(service.select('age')).toBe(28);
        expect(service.select('role')).toBe('manager');
      });

      test(...useSend({ type: 'PARTIAL_UPDATE', payload: { name: 'Bob' } }, 6));

      test('#07 => Check partial update maintains other fields', () => {
        expect(service.select('name')).toBe('Bob');
        expect(service.select('age')).toBe(28);
        expect(service.select('role')).toBe('manager');
      });
    });

    describe('#03 => Unmapped event falls back to else function', () => {
      const machine = _machine2;

      const service = interpret(machine, {
        context: { name: 'John', age: 30, role: 'admin' },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            resetAll: assign(['context.name', 'context.age', 'context.role'], {
              UPDATE_ALL: ({ payload }) => [payload.name, payload.age, payload.role],
              else: ({ event }) => ['reset_name', 0, (event as any).type],
            }),
          },
        }));
      });

      test(...useSend('RESET_ALL', 4));

      test('#05 => Check name from else fallback', () => {
        expect(service.select('name')).toBe('reset_name');
      });

      test('#06 => Check age from else fallback', () => {
        expect(service.select('age')).toBe(0);
      });

      test('#07 => Check role from else fallback', () => {
        expect(service.select('role')).toBe('RESET_ALL');
      });
    });

    describe('#04 => Event with undefined handler in map falls back to else', () => {
      const machine = _machine2;

      const service = interpret(machine, {
        context: { name: 'John', age: 30, role: 'admin' },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            resetAll: assign('context.name', {
              UPDATE_ALL: ({ payload }) => payload.name,
              else: () => 'reset_default',
            }),
          },
        }));
      });

      test(...useSend('RESET_ALL', 4));

      test('#05 => Check name from else fallback when handler undefined', () => {
        expect(service.select('name')).toBe('reset_default');
      });
    });

    describe('#05 => Multi-key assign array', () => {
      const machine = _machine2;

      const service = interpret(machine, {
        context: { name: 'John', age: 30, role: 'admin' },
      });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test(...start(1));
      test(...useValue('idle', 2));

      test('#03 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            updateAll: assign(['context.name', 'context.age'], {
              UPDATE_ALL: ({ payload }) => [payload.name, payload.age],
            }),
          },
        }));
      });

      test(
        ...useSend(
          {
            type: 'UPDATE_ALL',
            payload: { name: 'MultiName', age: 99, role: 'admin' },
          },
          4,
        ),
      );

      test('#05 => Check multi-assigned name', () => {
        expect(service.select('name')).toBe('MultiName');
      });

      test('#06 => Check multi-assigned age', () => {
        expect(service.select('age')).toBe(99);
      });
    });
  });

  describe('#03 => Lifecycle events (INIT_EVENT, ALWAYS_EVENT)', () => {
    describe('#01 => Property assign with else on INIT_EVENT and ALWAYS_EVENT', () => {
      const machine = _machine3;

      const service = interpret(machine, { context: { propValue: 'default' } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test('#00 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            initProp: assign('context.propValue', {
              TRIGGER_ALWAYS: () => 'trigger',
              else: ({ event }) => `init_${(event as any).type}`,
            }),
            alwaysProp: assign('context.propValue', {
              TRIGGER_ALWAYS: () => 'trigger',
              else: ({ event }) => `always_${(event as any).type}`,
            }),
          },
        }));
      });

      test(...start(1));
      test(...useValue('init_state', 2));

      test('#03 => Check propValue set on INIT_EVENT via else', () => {
        expect(service.select('propValue')).toBe('init_machine$$init');
      });

      test(...useSend('TRIGGER_ALWAYS', 4));
      test(...useValue('final_state', 5));

      test('#06 => Check propValue set on ALWAYS_EVENT via else', () => {
        expect(service.select('propValue')).toBe(
          'always_/always_state/machine$$always',
        );
      });
    });

    describe('#02 => Property assign without else on INIT_EVENT', () => {
      const machine = _machine3;

      const service = interpret(machine, { context: { propValue: 'initial' } });

      const { useStateValue: useValue, start } = constructTests(service);

      test('#00 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            initProp: assign('context.propValue', {
              TRIGGER_ALWAYS: () => 'trigger',
            }),
          },
        }));
      });

      test(...start(1));
      test(...useValue('init_state', 2));

      test('#03 => Check propValue falls back to nothing on INIT_EVENT', () => {
        expect(service.select('propValue')).toBe('nothing');
      });
    });

    describe('#03 => Root assign with else on INIT_EVENT and ALWAYS_EVENT', () => {
      const machine = _machine4;

      const service = interpret(machine, { context: { name: 'default', age: 0 } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test('#00 => Add actions', () => {
        service.addOptions(({ assign }) => ({
          actions: {
            initRoot: assign(['context.name', 'context.age'], {
              TRIGGER_ALWAYS: () => ['trigger', 1],
              else: ({ event }) => [`root_init_${(event as any).type}`, 10],
            }),
            alwaysRoot: assign(['context.name', 'context.age'], {
              TRIGGER_ALWAYS: () => ['trigger', 1],
              else: ({ event }) => [`root_always_${(event as any).type}`, 20],
            }),
          },
        }));
      });

      test(...start(1));
      test(...useValue('init_state', 2));

      test('#03 => Check root name set on INIT_EVENT via else', () => {
        expect(service.select('name')).toBe('root_init_machine$$init');
      });

      test(...useSend('TRIGGER_ALWAYS', 4));
      test(...useValue('final_state', 5));

      test('#06 => Check root name set on ALWAYS_EVENT via else', () => {
        expect(service.select('name')).toBe(
          'root_always_/always_state/machine$$always',
        );
      });
    });

    describe('#04 => Custom action with else on INIT_EVENT and ALWAYS_EVENT', () => {
      const machine = _machine5;
      const actionSpy = vi.fn();

      const service = interpret(machine, { context: { status: 'default' } });

      const {
        useStateValue: useValue,
        send: useSend,
        start,
      } = constructTests(service);

      test('#00 => Add actions', () => {
        service.addOptions(({ voidAction }) => ({
          actions: {
            initAction: voidAction(({ event }) => {
              actionSpy((event as any).type);
            }),
            alwaysAction: voidAction(({ event }) => {
              actionSpy((event as any).type);
            }),
          },
        }));
      });

      test(...start(1));
      test(...useValue('init_state', 2));

      test('#03 => Check actionSpy called on INIT_EVENT', () => {
        expect(actionSpy).toHaveBeenCalledWith('machine$$init');
      });

      test(...useSend('TRIGGER_ALWAYS', 4));
      test(...useValue('final_state', 5));

      test('#06 => Check actionSpy called on ALWAYS_EVENT', () => {
        expect(actionSpy).toHaveBeenCalledWith('machine$$init');
      });
    });
  });

  describe('#04 => String event handling (reduceFnMap check5)', () => {
    const machine = _machine1;

    describe('#01 => String event with else fallback', () => {
      const { actions } = machine.createOptions(({ assign }) => ({
        actions: {
          setValue: assign('context.value', {
            SET_VALUE: ({ payload }) => payload.val,
            else: ({ event }) => `fallback_${event}`,
          }),
        },
      }));

      const state = {
        context: { value: 'initial', count: 0 },
        event: 'SOME_STRING_EVENT',
      } as any;

      const result = actions?.setValue?.(state);

      test('#01 => is an object', () => expect(typeof result).toBe('object'));

      test('#02 => sets value via else with string event', () => {
        expect(result).toEqual({
          mergers: [
            {
              key: 'context.value',
              source: { context: { value: 'fallback_SOME_STRING_EVENT' } },
            },
          ],
        });
      });
    });

    describe('#02 => String event without else (fallback to nothing)', () => {
      const { actions } = machine.createOptions(({ assign }) => ({
        actions: {
          setValue: assign('context.value', {
            SET_VALUE: ({ payload }) => payload.val,
          }),
        },
      }));

      const state = {
        context: { value: 'initial', count: 0 },
        event: 'SOME_STRING_EVENT',
      } as any;

      const result = actions?.setValue?.(state);

      test('#01 => is an object', () => expect(typeof result).toBe('object'));

      test('#02 => sets value to "nothing"', () => {
        expect(result).toEqual({
          mergers: [
            { key: 'context.value', source: { context: { value: 'nothing' } } },
          ],
        });
      });
    });
  });
});
