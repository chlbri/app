import type { Cast } from '@bemedev/app/bemedev';
import type {
  AnyInterpreter,
  AsyncInterpreter,
  PrimitiveObject,
  SyncInterpreter,
} from '@bemedev/app/types';
import type { SolidAsyncInterpreter } from './async';
import type { SolidSyncInterpreter } from './sync';

export type OutputSolidInterpreter<M extends AnyInterpreter> =
  M extends SyncInterpreter<
    infer C,
    infer Pc,
    infer Tc,
    infer E,
    infer A,
    infer Ta,
    infer Eo,
    infer AllPaths,
    infer Mo,
    infer L
  >
    ? SolidSyncInterpreter<
        C,
        Pc,
        Cast<Tc, PrimitiveObject>,
        E,
        A,
        Ta,
        Eo,
        AllPaths,
        Mo,
        L
      >
    : M extends AsyncInterpreter<
          infer C,
          infer Pc,
          infer Tc,
          infer E,
          infer A,
          infer Ta,
          infer Eo,
          infer AllPaths,
          infer Mo,
          infer L
        >
      ? SolidAsyncInterpreter<
          C,
          Pc,
          Cast<Tc, PrimitiveObject>,
          E,
          A,
          Ta,
          Eo,
          AllPaths,
          Mo,
          L
        >
      : never;

export type Pipe_F = <const M extends AnyInterpreter>(
  service: M,
) => OutputSolidInterpreter<M>;
