import { interpret } from '@bemedev/app';
import { createMachine } from '@bemedev/app';
import { createConfig } from '@bemedev/app';
import { notU } from '@bemedev/app/utils';
import { type } from '@bemedev/typings';
import { DELAY } from './constants';
import { fakeDB } from './fakeDB';
import { machine1 } from './machine1.fsm';
import { returnFalse } from '@bemedev/app/guards';
// #region machine2

export const config2 = createConfig({
  initial: 'idle',
  states: {
    idle: { activities: { DELAY: 'inc' }, on: { NEXT: '/working' } },
    working: {
      type: 'parallel',
      activities: { DELAY2: { actions: 'inc2' } },
      on: { FINISH: '/final' },
      states: {
        fetch: {
          initial: 'idle',
          states: {
            idle: {
              activities: {
                DELAY: 'sendPanelToUser',
                DELAY2: { guards: 'returnFalse', actions: 'inc2' },
              },
              on: {
                FETCH: {
                  guards: 'isInputNotEmpty',
                  target: '/working/fetch/fetch',
                },
              },
            },
            fetch: { entry: 'insertData', always: '/working/fetch/idle' },
          },
        },
        ui: {
          initial: 'idle',
          states: {
            idle: {
              on: {
                WRITE: { actions: 'write', target: '/working/ui/input' },
              },
            },
            input: {
              activities: {
                DELAY: {
                  guards: 'isInputEmpty',
                  actions: 'askUsertoInput',
                },
              },
              on: {
                WRITE: [
                  {
                    guards: 'isInputNotEmpty',
                    actions: 'write',
                    target: '/working/ui/idle',
                  },
                  '/working/ui/idle',
                ],
              },
            },
            final: {},
          },
        },
      },
    },
    final: {},
  },
});

export const typings2 = {
  eventsMap: type(({ primitiveObject }) => ({
    FETCH: 'never',
    WRITE: primitiveObject({ value: 'string' }),
    NEXT: 'never',
    FINISH: 'never',
  })),
  pContext: type({ iterator: 'number' }),
  context: type(({ array }) => ({
    iterator: 'number',
    input: 'string',
    data: array('string'),
  })),
  actorsMap: type({ children: { machine1: { NEXT: 'never' } } }),
} as const;

export const machine2 = createMachine(
  {
    actors: { machine1: { contexts: { iterator: 'iterator' }, on: {} } },
    ...config2,
  },
  { ...typings2, sync: true },
).provideOptions(({ isNotValue, isValue, assign, action }) => ({
  actions: {
    inc: assign(
      'iterator',
      ({ context }) => notU(context?.iterator) + 1,
    ),
    inc2: assign(
      'iterator',
      ({ context }) => notU(context?.iterator) + 4,
    ),
    sendPanelToUser: action(() => console.log('sendPanelToUser')),
    askUsertoInput: action(() => console.log('Input, please !!')),
    write: assign('input', {
      WRITE: ({ payload: { value } }) => value,
    }),
    insertData: assign('data', ({ context }) =>
      fakeDB
        .filter(item => item.name.includes(context?.input ?? ''))
        .map(item => item.name),
    ),
  },
  guards: {
    isInputEmpty: isValue('context.input', ''),
    isInputNotEmpty: isNotValue('context.input', ''),
    returnFalse,
  },
  actors: {
    children: {
      machine1: () => interpret(machine1, { context: { iterator: 0 } }),
    },
  },
  delays: { DELAY, DELAY2: 2 * DELAY },
}));

const _config2 = createConfig({
  ...config2,
  actors: { machine1: { contexts: { iterator: 'iterator' }, on: {} } },
  states: {
    ...config2.states,
    idle: { entry: 'debounce', ...config2.states.idle },
  },
});

export const _machine2 = createMachine(_config2, {
  ...typings2,
  sync: true,
}).provideOptions(
  ({
    isNotValue,
    isValue,
    assign,
    action,
    debounce: _debounce,
    batch,
    swap,
  }) => ({
    actions: {
      inc: assign(
        'iterator',
        ({ context }) => notU(context?.iterator) + 1,
      ),

      inc2: assign(
        'iterator',
        ({ context }) => notU(context?.iterator) + 4,
      ),
      sendPanelToUser: action(() => console.log('sendPanelToUser')),
      askUsertoInput: action(() => console.log('Input, please !!')),
      // write: assign('input', {
      //   WRITE: ({ payload: { value } }) => value,
      // }),
      write: assign(
        'input',
        swap(
          (value: string) => value,
          'WRITE',
        )({ '[0]': '[0].payload.value' }),
      ),
      insertData: assign('data', ({ context }) =>
        fakeDB
          .filter(item => item.name.includes(context?.input ?? ''))
          .map(item => item.name),
      ),
      debounce: batch(
        action(() => console.log('Debounced action executed')),
        _debounce(
          assign('iterator', () => 1000),
          { ms: 10_000, id: 'debounce-action' },
        ),
      ),
    },

    guards: {
      isInputEmpty: isValue('context.input', ''),
      isInputNotEmpty: isNotValue('context.input', ''),
      returnFalse,
    },
    actors: {
      children: {
        machine1: () => interpret(machine1, { context: { iterator: 0 } }),
      },
    },
    delays: { DELAY, DELAY2: 2 * DELAY },
  }),
);

// #endregion
