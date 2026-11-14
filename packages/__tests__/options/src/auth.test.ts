import { createOptions } from '@bemedev/app-options';

import auth from './contracts/auth.contract';
import { interpretContract, machineWithOptions } from './fixtures';

describe('#01 => auth', () => {
  const options = createOptions(auth)(({ assign, isDefined }) => ({
    actions: { setUser: assign('user', { LOGIN: ({ payload }) => payload.name }) },
    guards: { hasToken: isDefined('pContext.token') },
  }));

  const machine = machineWithOptions(auth, options);

  const service = interpretContract(machine, {
    context: { user: '' },
    pContext: { token: 'secret' },
  });

  test('#01 => starts anonymous', async () => {
    await service.start();
    expect(service.state.value).toBe('anonymous');
  });

  test('#02 => LOGIN awaits the async assign', async () => {
    await service.send({ type: 'LOGIN', payload: { name: 'bri' } });
    expect(service.state.value).toBe('authenticated');
    expect(service.select('user')).toBe('bri');
  });

  test('#03 => LOGOUT returns to anonymous', async () => {
    await service.send('LOGOUT');
    expect(service.state.value).toBe('anonymous');
  });
});

describe('#02 => auth without a token', () => {
  const options = createOptions(auth)(({ isDefined }) => ({
    guards: { hasToken: isDefined('pContext.token') },
  }));

  const machine = machineWithOptions(auth, options);

  const service = interpretContract(machine, {
    context: { user: '' },
    pContext: {} as any,
  });

  test('#01 => the guard blocks the transition', async () => {
    await service.start();
    await service.send({ type: 'LOGIN', payload: { name: 'bri' } });
    expect(service.state.value).toBe('anonymous');
    expect(service.select('user')).toBe('');
  });
});
