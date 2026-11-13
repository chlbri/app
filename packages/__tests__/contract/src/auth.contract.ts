import { createContract } from '@bemedev/app-contract';
import { type } from '@bemedev/typings';

/**
 * Named contract registered by the CLI-generated `app.contract.gen.ts`.
 *
 * Its paths, events and `pContext` are resolved from the register entry, so the
 * type tests in `contract.test.ts` only pass when the CLI generated the file
 * with `--contract`.
 */
export default createContract(
  'auth',
  {
    initial: 'idle',
    states: { idle: { on: { LOGIN: '/authenticated' } }, authenticated: {} },
  },
  { pContext: type({ token: 'string' }), eventsMap: type({ LOGIN: 'never' }) },
);
