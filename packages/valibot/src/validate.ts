import { type NodeConfig2 } from '@bemedev/app/states';
import * as v from 'valibot';
import { Config_Schema } from './schema';
import { createBetterSet } from '@bemedev/better-set';

const _getTargetsFromConfig = (node: NodeConfig2, remain = '/') => {
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
export const getTargetsFromConfig = (node: NodeConfig2) => {
  return _getTargetsFromConfig(node, '/');
};

/**
 * Validates a machine configuration against the generated Valibot schema.
 * Throws a Valibot error if validation fails.
 *
 * @param config - The machine configuration object to validate.
 * @returns The parsed machine configuration.
 */
export const validateMachine = (config: any) => {
  const targets = getTargetsFromConfig(config);
  const out = v.parse(Config_Schema(...targets), config);
  return out;
};

/**
 * Safely validates a machine configuration without throwing.
 *
 * @param config - The machine configuration object to validate.
 * @returns Valibot SafeParseResult object.
 */
validateMachine.safe = (config: any) => {
  const targets = getTargetsFromConfig(config);
  const out = v.safeParse(Config_Schema(...targets), config);
  return out;
};

/**
 * Alias for function {@linkcode validateMachine}.
 */
export const validate = validateMachine;
