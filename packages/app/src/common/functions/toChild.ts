import type { CommonChild } from '#common/machine';
import { toTransition } from '#transitions';
import { _any, identify } from '@bemedev/app-utils-bemedev';
import type { Contract, ContractOptions } from '@bemedev/app-contract';
import type { ChildConfig } from '../../actors/types';
import { toChildSrc } from './toChildSrc';

/**
 * Function signature for converting child configuration into structured child actor instance.
 *
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - State path string type.
 * @template `R` - Child machine return type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 *
 * @param child - Child configuration input.
 * @param options - Machine options object.
 * @param events - List of machine event strings.
 *
 * @returns Structured child instance of type {@linkcode CommonChild}.
 */
export type ToChild_F = <
  Ct extends Contract = Contract,
  R extends { eventsMap: any } = { eventsMap: any },
>(
  child: ChildConfig & { __id: string },
  options: ContractOptions<Ct> | undefined,
  ...events: string[]
) => CommonChild<Ct, R>;

/**
 * Converts an emitter config to an emitter object with a source and transitions.
 *
 * @param child - The child configuration to convert.
 * @param options - The machine options.
 * @param events - List of events of the machine.
 *
 * @returns An emitter object with a source and transitions.
 *
 * @see {@linkcode toChildSrc}, {@linkcode toTransition}
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
