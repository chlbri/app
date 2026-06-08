import type { CommonChild, SimpleMachineOptions2 } from '#common/machine';
import type { EventObject } from '#events';
import { toTransition } from '#transitions';
import { _any, identify } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type { ChildConfig } from '../../actors/types';
import { toChildSrc } from './toChildSrc';

export type ToChild_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R extends { eventsMap: any } = { eventsMap: any },
  Eo extends EventObject = EventObject,
>(
  child: ChildConfig & { __id: string },
  options: SimpleMachineOptions2 | undefined,
  ...events: string[]
) => CommonChild<Eo, Pc, Tc, T, R>;

/**
 * Converts an emitter config to an emitter object with a source and transitions.
 * @param child of type {@linkcode ChildConfig}, the child configuration to convert.
 * @param options of type {@linkcode SimpleMachineOptions2}, the machine options.
 * @param events of type {@linkcode string[]}, list of events of the machine.
 * @returns an emitter object with a source and transitions.
 *
 * @see {@linkcode toChildSrc} for converting the source.
 * @see {@linkcode toTransition} for converting transitions.
 * @see {@linkcode toArray} for the type of the context.
 * @see {@linkcode ToChild_F} for more details
 */
export const toChild: ToChild_F = (child, options, ...events) => {
  const tMapper = (config: any) => {
    return toTransition(config, options, ...events);
  };

  const src = toChildSrc(child.__id, options?.actors?.children, ...events);

  const on = identify(child.on).map(tMapper);
  const contexts = Object.keys(child.contexts || {});
  const out = _any({ src, on, contexts }) as any;

  const { description } = child;
  if (description) out.description = description;

  return out;
};
