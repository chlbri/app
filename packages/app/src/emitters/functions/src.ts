import type { EventObject } from '#events';
import type { PrimitiveObject } from '@bemedev/typings';
import type { AsyncEmitterFunction, AsyncEmittersMap } from '../types';

/**
 * Function signature for resolving emitter source function from emitters map.
 *
 * @template Pc - Private context type.
 * @template {PrimitiveObject} Tc - Internal context type.
 * @template {string} T - State path string type.
 * @template {EventObject} Eo - Event object type.
 * @template R - Return type.
 *
 * @param emitter - Emitter name string.
 * @param emitters - Optional map of async emitters.
 *
 * @returns Resolved emitter function of type {@linkcode AsyncEmitterFunction} or `undefined`.
 */
export type ToEmitterSrc_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
  R = any,
>(
  emitter: string,
  emitters?: AsyncEmittersMap<Eo, Pc, Tc, T>,
) => AsyncEmitterFunction<Eo, Pc, Tc, T, R> | undefined;

/**
 * Resolves an emitter source function from the machine emitters options map.
 *
 * @param emitter - Emitter identifier.
 * @param emitters - Map of emitter functions.
 *
 * @returns Resolved emitter function or `undefined`.
 *
 * @see -- type {@linkcode ToEmitterSrc_F}
 */
export const toEmitterSrc: ToEmitterSrc_F = (emitter, emitters) => {
  return emitters?.[emitter] as any;
};
