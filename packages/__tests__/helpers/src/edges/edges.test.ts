import { interpret } from '@bemedev/app';
import { constructTests } from '@bemedev/app-vitest';
import atomicMachine from './atomic.machine';
import arrayAssignMachine from './arrayAssign/async.fsm';
import arrayAssignAsyncMachine from './arrayAssign/async.async.fsm';
import arrayAssignSyncMachine from './arrayAssign/sync.machine';
import complexArrayAssignMachine from './arrayAssign/complex.fsm';
import complexArrayAssignSyncMachine from './arrayAssign/complex.sync.fsm';

describe('EDGES CASES', () => {
  describe('#01 => Atomic machine', () => {
    const service = interpret(atomicMachine, { context: 'fr' });
    const { setlang, start, stop, lang } = constructTests(
      vi,
      service,
      ({ sender, contexts }) => ({
        setlang: sender('SET_LANG'),
        lang: contexts(c => c.context, 'lang'),
      }),
    );

    test(...start());
    test(...lang('fr'));
    test(...setlang('en'));
    test(...lang('en'));
    test(...setlang('es'));
    test(...lang('es'));
    test(...stop());
  });

  describe('#02 => arrayAssign', () => {
    describe('#01 => ArrayAssign machine, with async functions', () => {
      const service = interpret(arrayAssignAsyncMachine, {
        context: { number1: 0, number2: 0 },
      });
      const { incTheArray, start, stop, number1, number2 } =
        constructTests(vi, service, ({ sender, contexts }) => ({
          incTheArray: sender('INC'),
          number1: contexts(c => c.context.number1, 'number1'),
          number2: contexts(c => c.context.number2, 'number2'),
        }));

      test(...start());
      test(...number1(0));
      test(...number2(0));
      test(...incTheArray());
      test(...number1(1));
      test(...number2(1));
      test(...stop());
    });

    describe('#02 => ArrayAssign machine', () => {
      const service = interpret(arrayAssignMachine, {
        context: { number1: 0, number2: 0 },
      });
      const { incTheArray, start, stop, number1, number2 } =
        constructTests(vi, service, ({ sender, contexts }) => ({
          incTheArray: sender('INC'),
          number1: contexts(c => c.context.number1, 'number1'),
          number2: contexts(c => c.context.number2, 'number2'),
        }));

      test(...start());
      test(...number1(0));
      test(...number2(0));
      test(...incTheArray());
      test(...number1(1));
      test(...number2(1));
      test(...stop());
    });

    describe('#03 => ArrayAssignSync machine', () => {
      const service = interpret(arrayAssignSyncMachine, {
        context: { number1: 0, number2: 0 },
      });
      const { incTheArray, start, stop, number1, number2 } =
        constructTests(vi, service, ({ sender, contexts }) => ({
          incTheArray: sender('INC'),
          number1: contexts(c => c.context.number1, 'number1'),
          number2: contexts(c => c.context.number2, 'number2'),
        }));

      test(...start());
      test(...number1(0));
      test(...number2(0));
      test(...incTheArray());
      test(...number1(1));
      test(...number2(1));
      test(...stop());
    });

    describe('#04 => Complex arrayAssign machine', () => {
      const service = interpret(complexArrayAssignMachine, {
        context: {
          number1: 0,
          number2: 0,
          deep: { number3: 0, deep2: { number4: 0 } },
        },
      });
      const { incDeep, start, stop, number1, number2, number3, number4 } =
        constructTests(vi, service, ({ sender, contexts }) => ({
          incDeep: sender('INC'),
          number1: contexts(c => c.context.number1, 'number1'),
          number2: contexts(c => c.context.number2, 'number2'),
          number3: contexts(c => c.context.deep.number3, 'number3'),
          number4: contexts(c => c.context.deep.deep2.number4, 'number4'),
        }));

      test(...start());
      test(...number1(0));
      test(...number2(0));
      test(...number3(0));
      test(...number4(0));
      test(...incDeep());
      test(...number1(1));
      test(...number2(2));
      test(...number3(0));
      test(...number4(4));
      test(...incDeep());
      test(...number1(2));
      test(...number2(4));
      test(...number3(0));
      test(...number4(8));
      test(...stop());
    });

    describe('#05 => Complex sync arrayAssign machine', () => {
      const service = interpret(complexArrayAssignSyncMachine, {
        context: {
          number1: 0,
          number2: 0,
          deep: { number3: 0, deep2: { number4: 0 } },
        },
      });
      const { incDeep, start, stop, number1, number2, number3, number4 } =
        constructTests(vi, service, ({ sender, contexts }) => ({
          incDeep: sender('INC'),
          number1: contexts(c => c.context.number1, 'number1'),
          number2: contexts(c => c.context.number2, 'number2'),
          number3: contexts(c => c.context.deep.number3, 'number3'),
          number4: contexts(c => c.context.deep.deep2.number4, 'number4'),
        }));

      test(...start());
      test(...number1(0));
      test(...number2(0));
      test(...number3(0));
      test(...number4(0));
      test(...incDeep());
      test(...number1(1));
      test(...number2(2));
      test(...number3(0));
      test(...number4(4));
      test(...incDeep());
      test(...number1(2));
      test(...number2(4));
      test(...number3(0));
      test(...number4(8));
      test(...stop());
      test('#99 => machine is defined', () =>
        expect(service.machine).toBeDefined());
    });
  });
});
