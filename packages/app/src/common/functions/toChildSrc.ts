import type { ChildrenMap, CommonChildFunction2 } from '#common/machine';
import type { EventObject } from '#events';
import { reduceFnMap } from '#utils';
import type { PrimitiveObject } from '@bemedev/typings';

export type ToChildSrc_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  R extends { eventsMap: any } = { eventsMap: any },
>(
  child: string,
  children: ChildrenMap<Eo, Pc, Tc, T> | undefined,
  ...events: string[]
) => CommonChildFunction2<Eo, Pc, Tc, T, R> | undefined;

/**
 * Converts a child configuration to a child machine object.
 * @param child of type {@linkcode string}, the machine child identifier.
 * @param children of type {@linkcode ChildrenMap}, the map of children to look up the child configuration.
 * @param events of type {@linkcode string[]}, list of events of the machine.
 * @returns an emitter object with an id, or undefined if the emitter is not found.
 */
export const toChildSrc: ToChildSrc_F = (
  child,
  children,
  ...events
) => {
  const fn = children?.[child];
  const func = fn ? reduceFnMap(fn as any, ...events) : undefined;
  return func as any;
};
