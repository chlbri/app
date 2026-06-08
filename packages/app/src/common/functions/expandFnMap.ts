import type { AsyncAction2, SyncAction2 } from '#actions';
import type { EventObject } from '#events';
import { reduceFnMap } from '#utils';
import type { Cast } from '@bemedev/app-utils-bemedev';
import { recompose, type Decompose } from '@bemedev/decompose';
import type { PrimitiveObject } from '@bemedev/typings';
import { type FnMap } from '~types';

export type ExpandFnMap_F = {
  <
    Pc,
    Tc = PrimitiveObject,
    D = Decompose<
      {
        pContext: Pc;
        context: Tc;
      },
      { sep: '.'; object: 'both'; start: false }
    >,
    K extends Extract<keyof D, string> = Extract<keyof D, string>,
    R = D[K],
    T extends string = string,
    Eo extends EventObject = EventObject,
  >(
    key: K,
    fn: FnMap<Eo, Pc, Cast<Tc, PrimitiveObject>, T, R>,
    ...events: string[]
  ): AsyncAction2<Eo, Pc, Cast<Tc, PrimitiveObject>, T>;

  sync: <
    Pc,
    Tc = PrimitiveObject,
    D = Decompose<
      {
        pContext: Pc;
        context: Tc;
      },
      { sep: '.'; object: 'both'; start: false }
    >,
    K extends Extract<keyof D, string> = Extract<keyof D, string>,
    R = D[K],
    T extends string = string,
    Eo extends EventObject = EventObject,
  >(
    key: K,
    fn: FnMap<Eo, Pc, Cast<Tc, PrimitiveObject>, T, R>,
    ...events: string[]
  ) => SyncAction2<Eo, Pc, Cast<Tc, PrimitiveObject>, T>;
};

/**
 *
 * @param key  : type {@linkcode Decompose} [D] - The key to assign the result to in the context and the private context.
 * @param fn  : type {@linkcode FnMap} [E, P, Pc, Tc, R] - The function to reduce the events and promisees and performs the action.
 * @param events : type {@linkcode string[]} - The expected events.
 * @returns a {@linkcode AsyncAction2} function.
 *
 * @see {@linkcode reduceFnMap} for reducing the events and promisees.
 * @see {@linkcode Decompose} for decomposing the private context and context into paths.
 *
 */
export const expandFnMap: ExpandFnMap_F = (key, fn, ...events) => {
  const _fn = reduceFnMap(fn, ...events);

  return async ({ pContext, context, ...rest }) => {
    const result = await _fn({ pContext, context, ...rest });
    return recompose({ [key]: result });
  };
};

expandFnMap.sync = (key, fn, ...events) => {
  const _fn = reduceFnMap(fn, ...events);

  return ({ pContext, context, ...rest }) => {
    const result = _fn({ pContext, context, ...rest });
    return recompose({ [key]: result });
  };
};
