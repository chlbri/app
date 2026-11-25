import { type } from '@bemedev/app-contract/typings';
import { createMachine } from '@bemedev/app';

const litts = type(({ litterals }) => litterals('fr', 'en', 'es')).__type;

export default createMachine(
  'atomic',
  { on: { SET_LANG: { actions: ['setLang'] } } },
  { sync: true, context: type(litts), eventsMap: type({ SET_LANG: litts }) },
).provideOptions(({ assign }) => ({
  actions: { setLang: assign({ SET_LANG: c => c.payload }) },
}));
