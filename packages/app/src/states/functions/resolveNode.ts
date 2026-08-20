import { toAction } from '#actions';
import { toChild } from '#common/functions';
import type { SimpleMachineOptions2 } from '#common/machine';
import { toEmitter } from '#emitters';
import type { EventObject } from '#events';
import { toTransition } from '#transitions';
import { _any, identify, toArray } from '@bemedev/app-utils-bemedev';
import type { PrimitiveObject } from '@bemedev/typings';
import type { Node, NodeConfig2 } from '../types';
import { stateType } from './stateType';

/**
 * Function signature for resolving state node configuration into an executable type {@linkcode Node}.
 *
 * @template `Pc` - Private context type.
 * @template | {@linkcode PrimitiveObject} `Tc` - Internal context type.
 * @template `T` - Tags type.
 * @template | {@linkcode EventObject} `Eo` - Event object type.
 *
 * @param config - Node configuration object.
 * @param options - Machine options object.
 * @param events - List of machine event strings.
 *
 * @returns Resolved type {@linkcode Node} object.
 */
export type ResolveNode_F = <
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  T extends string = string,
  Eo extends EventObject = EventObject,
>(
  config: NodeConfig2,
  options?: SimpleMachineOptions2,
  ...events: string[]
) => Node<Eo, Pc, Tc, T>;

/**
 * Resolves a node configuration into a full node with all functions.
 *
 * @param config - The node configuration to resolve.
 * @param options - Optional machine options that may include actions and actors configurations.
 * @param events - The list of events of the machine.
 * @returns A structured representation of the node with its properties and transitions.
 *
 * @see {@linkcode toAction}, {@linkcode toTransition}, {@linkcode stateType}
 */
export const resolveNode: ResolveNode_F = (config, options, ...events) => {
  // #region functions for mapping
  const aMapper = (action: any) => {
    return toAction(action, options?.actions, ...events);
  };

  const tMapper = (config: any) => {
    return toTransition(config, options, ...events);
  };
  // #endregion

  const { description, initial, tags: _tags } = config;
  const __id = (config as any).__id;
  const type = stateType(config);
  const tags = toArray.typed(_tags);
  const entry = toArray.typed(config.entry).map(aMapper);
  const exit = toArray.typed(config.exit).map(aMapper);

  const states = identify(config.states).map(config =>
    resolveNode(config, options, ...events),
  );

  const on = identify(config.on).map(tMapper);
  const always = toArray.typed(config.always).map(tMapper);
  const after = identify(config.after).map(tMapper);
  const actors = identify(config.actors);

  const emitters = actors
    .filter(actor => 'next' in actor)
    .map(emitter => toEmitter(emitter, options, ...events));

  const children = actors
    .filter(actor => 'on' in actor || 'contexts' in actor)
    .map(child => toChild(child, options, ...events));

  const out = _any({
    type,
    entry,
    exit,
    tags,
    states,
    on,
    always,
    after,
    emitters,
    children,
  });

  if (__id) out.__id = __id;
  if (initial) out.initial = initial;
  if (description) out.description = description;

  return out;
};
