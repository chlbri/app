import { createMachine } from '@bemedev/app';

/**
 * Machine 1: Traffic Light
 * States: red, yellow, green
 * Transitions cycle through the states
 */
export const trafficLightMachine = createMachine(
  'traffic',
  {
    initial: 'red',
    states: {
      red: {
        on: { NEXT: '/yellow' },
      },
      yellow: {
        on: { NEXT: '/green' },
      },
      green: {
        on: { NEXT: '/red' },
      },
    },
  },
  {
    sync: true,
  },
);

/**
 * Machine 2: Toggle
 * States: on, off
 * Simple toggle between two states
 */
export const toggleMachine = createMachine(
  'toggle',
  {
    initial: 'off',
    states: {
      off: {
        on: { TOGGLE: '/on' },
      },
      on: {
        on: { TOGGLE: '/off' },
      },
    },
  },
  {
    sync: true,
  },
);
