import { typings } from '@bemedev/app/utils';
import { createMachine } from '@bemedev/app';

const litts = typings.any(({ litterals }) =>
  litterals('fr', 'en', 'es'),
).__type;

export default createMachine(
  'atomic',
  { on: { SET_LANG: { actions: ['setLang'] } } },
  {
    sync: true,
    context: typings.context(litts),
    eventsMap: typings.eventsMap({ SET_LANG: litts }),
  },
).provideOptions(({ assign }) => ({
  actions: { setLang: assign('context', { SET_LANG: c => c.payload }) },
}));
