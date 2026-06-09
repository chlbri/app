import { interpret } from '@bemedev/app';
import { constructTests } from '../../constructTests.js';
import _machine1 from './actions.1.machine';
import _machine2 from './actions.2.machine';

describe('Interpret for actions', () => {
  const action1 = vi.fn().mockReturnValue({});

  describe('#01 => string', () => {
    const service = interpret(_machine1, { mode: 'normal' });

    afterAll(() => {
      action1.mockClear();
    });

    const {
      send,
      useStateValue,
      start,
      useWarnings,
      addAction1,
      callTimes,
    } = constructTests(vi, service, ({ getIndex, service, tupleOf }) => ({
      addAction1: () =>
        tupleOf(`#${getIndex()} => add action`, () =>
          service.addOptions(() => ({ actions: { action1 } })),
        ),
      callTimes: (times = 0) =>
        tupleOf(`#${getIndex()} => Called ${times} times`, () =>
          expect(action1).toHaveBeenCalledTimes(times),
        ),
    }));

    test(...start());
    test(...useStateValue('state2'));
    test(...callTimes(0));
    describe(...useWarnings('Action (action1) is not defined'));
    test(...addAction1());
    test(...callTimes(0));
    test(...send('NEXT'));
    test(...callTimes(1));
  });

  describe('#02 => describer', () => {
    const service = interpret(_machine2);

    afterAll(() => {
      action1.mockClear();
    });

    const {
      send,
      useStateValue,
      start,
      callTimes,
      addAction1,
      useWarnings,
    } = constructTests(vi, service, ({ getIndex, service, tupleOf }) => ({
      addAction1: () =>
        tupleOf(`#${getIndex()} => add action`, () =>
          service.addOptions(() => ({ actions: { action1 } })),
        ),
      callTimes: (times = 0) =>
        tupleOf(`#${getIndex()} => Called ${times} times`, () =>
          expect(action1).toHaveBeenCalledTimes(times),
        ),
    }));

    test(...start());
    test(...useStateValue('state2'));
    test(...callTimes(0));
    describe(...useWarnings('Action (action1) is not defined'));
    test(...addAction1());
    test(...callTimes(0));
    test(...send('NEXT'));
    test(...callTimes(1));
  });
});
