import type { ChildrenMap, CommonChildFunction2 } from '#common/machine';
import type { EventObject } from '#events';
import { reduceFnMap } from '#utils';
import type { PrimitiveObject } from '@bemedev/typings';

/**
 * Function signature for converting child identifier into child machine function.
 *
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 * @template `R` - Child machine return type.
 *
 * @param child - Child identifier string.
 * @param children - Children map.
 * @param events - List of machine event strings.
 *
 * @returns Child machine function or `undefined`.
 */
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
 * @param child - The machine child identifier.
 * @param children - The map of children to look up the child configuration.
 * @param events - List of events of the machine.
 * @returns An emitter object with an id, or undefined if the emitter is not found.
 */
export const toChildSrc: ToChildSrc_F = (child, children, ...events) => {
  const fn = children?.[child];
  const func = fn ? reduceFnMap(fn as any, ...events) : undefined;
  return func as any;
};
