import { interpret } from '@bemedev/app';
import { counterMachine } from './machines/counter.machine';
import { trafficMachine } from './machines/traffic.machine';

export const counterService = interpret(counterMachine, {
  context: { count: 0, step: 1 },
});

export const trafficService = interpret(trafficMachine, {
  context: { cycles: 0 },
  pContext: {
    timers: { yellow: 1_000, green: 2_500, red: 4_000 },
    speed: 1,
  },
});

export type RootRouterContext = {
  counterService?: typeof counterService;
  trafficService?: typeof trafficService;
};
