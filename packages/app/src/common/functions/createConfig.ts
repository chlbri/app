import type { NodeConfig2 } from '#states';
import { _any } from '@bemedev/app-utils-bemedev';

export type CreateConfig_F = <const T extends NodeConfig2>(config: T) => T;

/**
 * Creates a machine configuration.
 * This function takes a configuration object and returns it as is.
 * It is a utility function to ensure that the configuration is of the correct type.
 *
 * @param value - The configuration object of type {@linkcode Config}.
 *
 * @returns The same configuration object of type {@linkcode Config}.
 *
 */
export const createConfig: CreateConfig_F = _any;
