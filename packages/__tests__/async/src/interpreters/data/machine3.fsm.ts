import { createMachine } from '@bemedev/app';
import { createConfig } from '@bemedev/app';
import { typings } from '@bemedev/app/utils';
import { type } from '@bemedev/typings';

export const config3 = createConfig({
  description: 'cdd',
  initial: 'state1',
  states: {
    state1: {
      initial: 'state11',
      states: {
        state11: { initial: 'state111', states: { state111: {} } },
        state12: { activities: { DELAY5: 'deal', DELAY17: 'deal17' } },
      },
    },
    state2: {
      after: {
        DELAY: { actions: ['dodo1', 'doré'] },
        DELAY2: '/state2',
        DELAY3: { actions: 'dodo2' },
      },
      on: {
        EVENT: { actions: ['dodo3', 'doré1'] },
        EVENT2: '/',
        EVENT3: { actions: 'dodo5' },
      },
      always: [
        { actions: 'dodo6', guards: 'guard2', target: '/state1/state11' },
        {
          actions: ['dodo7', 'doré3', 'doré1'],
          guards: 'guard2',
          target: '/state1/state12',
        },
        '/state1/state11',
      ],
    },
  },
  actors: { machine1: { on: {} } },
});

export const machine3 = createMachine(config3, {
  eventsMap: type({
    EVENT: { password: 'string', username: 'string' },
    EVENT2: 'boolean',
    EVENT3: { login: 'string', pwd: 'string' },
  }),
  pContext: type({ data: 'string' }),
  context: typings.context({ age: 'number' }),
  actorsMap: type({ children: { machine1: { NEXT: 'boolean' } } }),
});

export type Machine3 = typeof machine3;

export type Config3 = typeof config3;
