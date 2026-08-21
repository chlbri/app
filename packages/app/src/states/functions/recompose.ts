import { DEFAULT_DELIMITER } from '#constants';
import type { NodeConfig2 } from '../types';

/**
 * Function signature for URL shape recomposition.
 *
 * @template `T` - Value type.
 * @param shape - Shape string.
 * @param value - Target value.
 */
type Url_F = <T>(shape: string, value: T) => any;

/**
 * Recompose an object URL based on the provided shape and value.
 *
 * @param shape - The shape of the URL to recompose.
 * @param value - The value to recompose into the URL.
 * @returns A recomposed object URL.
 *
 * @see {@linkcode DEFAULT_DELIMITER}
 */
const recomposeObjectUrl: Url_F = (shape, value) => {
  const obj: any = {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { states, ...rest } = value as any;

  if (shape === DEFAULT_DELIMITER) {
    return rest;
  }

  const keys = shape.split(DEFAULT_DELIMITER).filter(str => str !== '');

  obj.states = {};
  if (keys.length === 1) {
    const key = keys.shift()!;
    obj.states[key] = value;
  } else {
    const key = keys.shift()!;
    const _value = recomposeObjectUrl(keys.join(DEFAULT_DELIMITER), value);

    obj.states[key] = _value;
  }
  return obj;
};

/**
 * Recursively merges two node configuration objects.
 *
 * @param target - The base configuration object.
 * @param source - The incoming configuration object to merge.
 *
 * @returns The merged configuration object.
 */
const mergeNodeConfig = (target: any, source: any): any => {
  const out: any = { ...target };
  for (const [key, val] of Object.entries(source)) {
    if (
      key in out &&
      typeof out[key] === 'object' &&
      out[key] !== null &&
      !Array.isArray(out[key]) &&
      typeof val === 'object' &&
      val !== null &&
      !Array.isArray(val)
    ) {
      out[key] = mergeNodeConfig(out[key], val);
    } else {
      out[key] = val;
    }
  }
  return out;
};

/**
 * Function signature for configuration object recomposition.
 *
 * @template | {@linkcode NodeConfig2} `T` - Configuration type.
 * @param shape - Target configuration shape.
 *
 * @returns Recomposed configuration object of type {@linkcode NodeConfig2}.
 */
export type RecomposeConfig_F = <T extends NodeConfig2>(shape: T) => NodeConfig2;

/**
 * Recompose a configuration object into a nested structure based on the provided shape.
 *
 * @param shape - The shape of the configuration to recompose.
 * @returns A recomposed configuration object.
 */
export const recomposeConfig: RecomposeConfig_F = shape => {
  const entries = Object.entries(shape);
  let output: any = {};
  entries.forEach(([key, value]) => {
    output = mergeNodeConfig(output, recomposeObjectUrl(key, value));
  });

  return output as any;
};
