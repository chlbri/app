// import { DELAY } from '../../../async/src/interpreters/async/data';
import { interpret } from '@bemedev/app';
import { createMachine } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import { type } from '@bemedev/typings';

export const DELAY = 60;
export const machine1 = createMachine(
  {
    initial: 'idle',
    states: {
      idle: {
        activities: { DELAY: 'inc' },
        on: { NEXT: { description: 'Next', target: '/final' } },
      },
      final: { on: { NEXT: '/idle' } },
    },
  },
  { context: type({ iterator: 'number' }) },
).provideOptions(({ assign }) => ({
  actions: {
    inc: assign('context.iterator', ({ context }) => context.iterator + 1),
  },
  delays: { DELAY },
}));

export const hook = () => {
  const service = interpret(machine1, { context: { iterator: 0 } });

  const { useNext, useIterator, waiter, start, stop } = constructTests(
    vi,
    service,
    ({ contexts, sender, waiter }) => ({
      useNext: sender('NEXT'),
      useIterator: contexts(
        ({ context }) => context?.iterator,
        'iterator',
      ),
      waiter: waiter(DELAY),
    }),
  );

  return { service, useNext, useIterator, waiter, start, stop };
};
