import type { Fn } from '@bemedev/app-utils-bemedev';
import { tupleOf } from '@bemedev/app-utils-bemedev';
import type { NodeConfig2 } from '../types';
import { isAtomic, isParallel } from './checks';

/**
 * Function signature for initial configuration resolver.
 */
export type InitialConfig_F = Fn<[body: NodeConfig2], NodeConfig2>;

/**
 * Returns the initial configuration of a state machine.
 *
 * @param body - The state machine configuration to process.
 * @returns The initial configuration of the state machine.
 *
 * @see {@linkcode isAtomic}, {@linkcode isParallel}
 */
export const initialConfig: InitialConfig_F = body => {
  const check0 = body === undefined || body === null;
  if (check0) return {};
  const check1 = isAtomic(body);
  if (check1) return body;

  const check2 = isParallel(body);

  if (check2) {
    const { states: _states, ...config } = body;
    const entries1 = Object.entries(_states).map(([key, state]) => {
      const reduced = initialConfig(state);
      return tupleOf(key, reduced);
    });

    const states = entries1.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as any);

    const out = { ...config, states };
    return out;
  }

  const __id = body.initial!;

  const initial = body.states[__id];
  if (!initial) {
    const { states: _states, ...config } = body;
    const entries1 = Object.entries(_states).map(([key, state]) => {
      const reduced = initialConfig(state);
      return tupleOf(key, reduced);
    });

    const states = entries1.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as any);

    const out = { ...config, states };
    return out;
  }

  const check4 = isAtomic(initial);
  if (check4) {
    const out = { ...body, states: { [__id]: initial } };
    return out;
  }

  const out = { ...body, states: { [__id]: initialConfig(initial) } };
  return out;
};
