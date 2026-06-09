// import { constructTests } from '#fixtures';
import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import { toggleMachine, trafficLightMachine } from './machines.machine';

describe('Machines', () => {
  describe('trafficLightMachine', () => {
    const service = interpret(trafficLightMachine);

    const { start, send, stop, useStateValue } = constructTests(vi, service);

    test(...start());
    test(...useStateValue('red'));
    test(...send('NEXT'));
    test(...useStateValue('yellow'));
    test(...send('NEXT'));
    test(...useStateValue('green'));
    test(...send('NEXT'));
    test(...useStateValue('red'));
    test(...stop());
  });

  describe('toggleMachine', () => {
    const service = interpret(toggleMachine);
    const { start, send, stop, useStateValue } = constructTests(vi, service);

    test(...start());
    test(...useStateValue('off'));
    test(...send('TOGGLE'));
    test(...useStateValue('on'));
    test(...send('TOGGLE'));
    test(...useStateValue('off'));
    test(...stop());
  });
});
