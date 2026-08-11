import type { NodeConfig2 } from '#states';
import { _any } from '@bemedev/app-utils-bemedev';

/**
 * Function signature for machine configuration creation helper.
 *
 * @template {NodeConfig2} T - Node configuration type.
 *
 * @param config - Configuration object input.
 *
 * @returns Same configuration object of type `T`.
 */
export type CreateConfig_F = <const T extends NodeConfig2>(config: T) => T;

/**
 * Creates a machine configuration.
 * This function takes a configuration object and returns it as is.
 * It is a utility function to ensure that the configuration is of the correct type.
 *
 * @param config - The configuration object of type {@linkcode NodeConfig2}.
 *
 * @returns The same configuration object of type {@linkcode NodeConfig2}.
 */
export const createConfig: CreateConfig_F = _any;
