import { interpret } from '#exports/interpret';
import { constructTests } from '#fixtures';
import atomicMachine from './atomic.machine';

describe('EDGES CASES', () => {
  describe('#01 => Atomic machine', () => {
    const service = interpret(atomicMachine, { context: 'fr' });
    const { setlang, start, stop, lang } = constructTests(
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
});
