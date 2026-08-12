import { createMachine } from '@bemedev/app';
import { type } from '@bemedev/app/bemedev';
import { connection, edge, node } from './machine.typings';

export default createMachine(
  'machine',
  {
    initial: 'idle',
    states: {
      idle: { on: { START: { target: '/working' } } },
      working: { on: { CONNECT: { actions: 'connectEdge' } } },
    },
  },
  {
    context: type(({ array, use }) => ({
      nodes: array(use(node)),
      edges: array(use(edge)),
      history: array({ nodes: array(use(node)), edges: array(use(edge)) }),
    })),
    eventsMap: type(({ use }) => ({
      START: 'never',
      CONNECT: use(connection),
    })),
  },
);
