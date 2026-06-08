import type { SimpleMachineOptions2 } from '#common/machine';
import type { EventObject } from '#events';
import { toTransition } from '#transitions';
import { toArray } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type { EmitterConfig } from '../../actors/types';
import type { AsyncEmitter } from '../types';
import { toEmitterSrc } from './src';

export type ToEmitter_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  R = any,
  Eo extends EventObject = EventObject,
>(
  emitter: EmitterConfig & { __id: string },
  options: SimpleMachineOptions2 | undefined,
  ...events: string[]
) => AsyncEmitter<Eo, Pc, Tc, T, R>;

/**
 * Converts an emitter config to an emitter object with a source and transitions.
 * @param emitter of type {@linkcode EmitterConfig}, the emitter config.
 * @param options of type {@linkcode SimpleMachineOptions2}, the machine options.
 * @param events of type {@linkcode string[]}, list of events of the machine.
 * @returns an emitter object with a source and transitions.
 *
 * @see {@linkcode toEmitterSrc} for converting the source.
 * @see {@linkcode toTransition} for converting transitions.
 * @see {@linkcode toArray.typed} for the type of the context.
 * @see {@linkcode ToEmitter_F} for more details
 */
export const toEmitter: ToEmitter_F = (
  emitter,
  options,
  ...events
) => {
  const src = toEmitterSrc(
    emitter.__id,
    options?.actors?.emitters,
  );

  const next = toArray
    .typed(emitter.next)
    .map(config =>
      toTransition(config as any, options, ...events),
    );

  const error = toArray
    .typed(emitter.error)
    .map(config =>
      toTransition(config as any, options, ...events),
    );

  const complete = toArray.typed(emitter.complete).map(config => {
    const check1 = typeof config === 'object' && 'actions' in config;
    if (check1) return toTransition(config, options, ...events);

    return toTransition({ actions: config }, options, ...events);
  });

  const out = {
    src,
    resolves: next,
    catch: error,
    finally: complete,
  } as any;

  const { description } = emitter;
  if (description) out.description = description;

  return out;
};
