import { createMachine, interpret } from '@bemedev/app';
import { pipe } from '@bemedev/app-solidjs';
import { solidTest } from '../solidTest';

describe('TESTS', () => {
  describe('#01 => Sync', () => {
    const machine = createMachine(
      {
        initial: 'idle',
        states: {
          idle: {
            on: {
              PLAY: '/playing',
            },
          },
          playing: {},
        },
      },
      {
        sync: true,
      },
    );

    test('creates root and avoids warning', () => {
      const service = interpret(machine);
      const _solid = pipe(service);
      const solid = solidTest(_solid);

      expect(solid.status()()).toBe('starting');

      solid.start();
      expect(solid.status()()).toBe('working');

      solid.dispose();
    });
  });
  describe('#02 => Async', () => {
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          on: {
            PLAY: '/playing',
          },
        },
        playing: {},
      },
    });
    test('creates root and avoids warning', () => {
      const service = interpret(machine);
      const _solid = pipe(service);
      const solid = solidTest(_solid);

      expect(solid.status()()).toBe('starting');

      solid.start();
      expect(solid.status()()).toBe('busy');

      solid.dispose();
    });
  });
});
