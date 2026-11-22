import type { ChildrenMap, CommonChildFunction2 } from '#common/machine';
import { reduceFnMap } from '@bemedev/app-options/internal';
import type { Contract } from '@bemedev/app-options';

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
  Ct extends Contract = Contract,
  R extends { eventsMap: any } = { eventsMap: any },
>(
  child: string,
  children: ChildrenMap<Ct> | undefined,
  ...events: string[]
) => CommonChildFunction2<Ct, R> | undefined;

/**
 * Converts a child configuration to a child machine object.
 *
 * @param child - The machine child identifier.
 * @param children - The map of children to look up the child configuration.
 * @param events - List of events of the machine.
 *
 * @returns The resolved child machine function, or `undefined` if not found.
 */
export const toChildSrc: ToChildSrc_F = (child, children, ...events) => {
  const fn = children?.[child];
  const func = fn ? reduceFnMap(fn as any, ...events) : undefined;
  return func as any;
};
