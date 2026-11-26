import { createMachine, interpret } from '@bemedev/app';
import { type } from '@bemedev/app-contract/typings';
import { constructTests } from '@bemedev/app-vitest';
import { DELAY } from '../interpreters/data';

export const machine1 = createMachine(
  {
    initial: 'idle',
    states: {
      idle: { activities: { DELAY: 'inc' }, on: { NEXT: { target: '/final' } } },
      final: { on: { NEXT: '/idle' } },
    },
  },
  { context: type({ iterator: 'number' }), sync: true },
).provideOptions(({ assign }) => ({
  actions: { inc: assign('iterator', ({ context }) => context.iterator + 1) },

  delays: { DELAY },
}));

export const hook = () => {
  const service = interpret(machine1, { context: { iterator: 0 } });

  const { useNext, useIterator, waiter, start, stop } = constructTests(
    service,
    ({ contexts, sender, waiter }) => ({
      useNext: sender('NEXT'),
      useIterator: contexts(({ context }) => context?.iterator, 'iterator'),
      waiter: waiter(DELAY),
    }),
  );

  return { service, useNext, useIterator, waiter, start, stop };
};
