import type { _TransitionsConfig } from '../types';

type Output = {
  actions: Set<string>;
  guards: Set<string>;
  targets: Set<string>;
  events: Set<string>;
  actors: Set<string>;
  delays: Set<string>;
  pContextKeys: Set<string>;
  emitters: Set<string>;
  children: Set<string>;
};

/**
 *  Extracts the target, actions, guards, and description from a transition configuration.
 *
 * @param transitions
 * @returns An array of objects containing the target, actions, guards, and description for each transition configuration.
 *
 * @see {@linkcode _TransitionsConfig}

 */
export const reduceTransitionsConfig = (
  transitions: _TransitionsConfig,
): Output => {
  const actions = new Set<string>();
  const guards = new Set<string>();
  const targets = new Set<string>();
  const events = new Set<string>();
  const actors = new Set<string>();
  const delays = new Set<string>();
  const pContextKeys = new Set<string>();
  const emitters = new Set<string>();
  const children = new Set<string>();

  return {
    actions,
    guards,
    targets,
    events,
    actors,
    delays,
    pContextKeys,
    emitters,
    children,
  };
};
