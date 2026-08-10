import { type NodeConfig2 } from '@bemedev/app/states';
import * as v from 'valibot';
import { Config_Schema } from './schema';
import { createBetterSet } from '@bemedev/better-set';

/**
 * Internal helper to recursively extract state target paths from a node config.
 *
 * @param node - The machine configuration node of type {@linkcode NodeConfig2}.
 * @param remain - The accumulated path prefix string.
 *
 * @returns A set of extracted state path target strings.
 *
 * @see {@linkcode createBetterSet}
 */
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
 * Extracts target state paths from the given machine node configuration.
 *
 * @param node - The machine configuration node of type {@linkcode NodeConfig2}.
 *
 * @returns Set of target state paths starting from root.
 *
 * @see {@linkcode _getTargetsFromConfig}
 */
export const getTargetsFromConfig = (node: NodeConfig2) => {
  return _getTargetsFromConfig(node, '/');
};

/**
 * Validates a machine configuration against the generated Valibot schema.
 * Throws a Valibot error if validation fails.
 *
 * @param config - The machine configuration object to validate.
 *
 * @returns The parsed machine configuration object.
 *
 * @see {@linkcode getTargetsFromConfig}, {@linkcode Config_Schema}
 */
export const validateMachine = (config: any) => {
  const targets = getTargetsFromConfig(config);
  const out = v.parse(Config_Schema(...targets), config);
  return out;
};

/**
 * Safely validates a machine configuration without throwing an exception.
 *
 * @param config - The machine configuration object to validate.
 *
 * @returns Valibot safe parse result object.
 *
 * @see {@linkcode validateMachine}
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
