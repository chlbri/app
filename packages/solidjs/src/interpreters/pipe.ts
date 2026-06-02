import type { Pipe_F } from './pipe.types';
import { SolidSyncInterpreter } from './sync';
import { _any } from '@bemedev/app/bemedev';

export type * from './pipe.types';

export const pipe: Pipe_F = service => {
  const check = service.TYPE === 'sync';
  if (check) {
    return _any(new SolidSyncInterpreter(_any(service)));
  }
  return _any(new SolidSyncInterpreter(_any(service)));
};
