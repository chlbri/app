import { interpret } from '@bemedev/app';
import { counterMachine } from './machines/counter';

export const createCounterService = () =>
  interpret(counterMachine, { context: { count: 0, speed: 1, logs: [] } });

export const counterService = interpret(counterMachine, {
  context: { count: 0, speed: 1, logs: [] },
});

export type RootRouterContext = {
  counterService?: typeof counterService;
  counterServiceTest?: typeof counterService;
};
