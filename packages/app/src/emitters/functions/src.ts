import type { EventObject } from '#events';
import type { PrimitiveObject } from '@bemedev/typings';
import type { AsyncEmitterFunction, AsyncEmittersMap } from '../types';

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

export const toEmitterSrc: ToEmitterSrc_F = (emitter, emitters) => {
  return emitters?.[emitter] as any;
};
