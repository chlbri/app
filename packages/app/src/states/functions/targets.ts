import { createBetterSet } from '../../bemedev';
import type { NodeConfig } from '../types';

const _getTargetsFromConfig = (node: NodeConfig, remain = '/') => {
  const out = createBetterSet<string>();
  out.add('/');
  const { states } = node;

  if (states) {
    const entries = Object.entries(states);
    entries.forEach(([key, value]) => {
      out.add(`${remain}${key}`);
      const subOut = _getTargetsFromConfig(value, `${remain}${key}/`);
      out.add(...subOut);
    });
  }

  return out;
};

/**
 * Returns an array of targets from the given node config.
 * @param node - The node config to get targets from.
 * @returns An array of targets.
 *
 * @see {@linkcode getTargetsFromConfig} for the implementation.
 */
export const getTargetsFromConfig = (node: NodeConfig) => {
  return _getTargetsFromConfig(node, '/');
};
