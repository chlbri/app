// oxlint-disable-next-line no-unused-vars
import type { Register } from '@bemedev/app/types';
import type { ConfigPaths } from '../../utils/parseTree.types';

/**
 * Converts a set of string values into a TypeScript literal union type string.
 *
 * @param set - Iterable set or array of string tokens.
 *
 * @returns Formatted union type string.
 */
const setToUnion = (set: any): string => {
  const values: string[] = [];
  for (const v of set) {
    values.push(v);
  }

  if (values.length === 0) return 'never';
  return values.map(v => `'${v}'`).join(' | ');
};

/**
 * Converts an array of state paths into a TypeScript union type string.
 *
 * @param paths - Array of path strings.
 *
 * @returns Formatted paths union type string.
 */
const pathsToUnion = (paths: string[]): string => {
  if (paths.length === 0) return 'never';
  return paths.map(p => `'${p}'`).join(' | ');
};

/**
 * Formats a `ConfigPaths` object into an inlined TypeScript interface declaration block.
 *
 * @param cp - Configuration paths object of type {@linkcode ConfigPaths}.
 * @param indent - Indentation offset level in spaces (defaults to `0`).
 *
 * @returns Serialized type declaration string.
 */
const configPathsToType = (cp: ConfigPaths, indent = 0): string => {
  const pad = ' '.repeat(indent);
  const nextPad = ' '.repeat(indent + 2);

  const targetUnion =
    cp.targets.length === 0 ? 'never' : cp.targets.map(t => `'${t}'`).join(' | ');

  const lines: string[] = [`{ targets: (${targetUnion}); `];

  if (cp.initial) {
    lines.push(`${nextPad}initial: '${cp.initial}';`);
  }

  if (cp.states && Object.keys(cp.states).length > 0) {
    lines.push(`${nextPad}states: {`);

    for (const [stateName, stateConfig] of Object.entries(cp.states)) {
      const stateType = configPathsToType(stateConfig as any, indent + 4);
      lines.push(`${' '.repeat(indent + 4)}'${stateName}': ${stateType};`);
    }

    lines.push(`${nextPad}};`);
  }

  lines.push(`${pad}}`);

  return lines.join('\n');
};

/**
 * Generates a `Register` interface entry string for a machine.
 *
 * @param name - Machine name string.
 * @param tree - Parsed tree context.
 * @param pContextType - Serialized protected context type string.
 *
 * @returns Formatted `Register` interface entry string.
 * @see type {@linkcode Register}
 */
export const emitRegisterEntry = (
  name: string,
  tree: any,
  pContextType: string,
): string => {
  const configPathsType = configPathsToType(tree.paths.map, 6);

  return [
    `    '${name}': {`,
    `      paths: {`,
    `        map: ${configPathsType};`,
    `        all: ${pathsToUnion(tree.paths.all)};`,
    `      };`,
    `      events: ${setToUnion(tree.events)};`,
    `      options: {`,
    `        children: ${setToUnion(tree.children)};`,
    `        emitters: ${setToUnion(tree.emitters)};`,
    `        tags:     ${setToUnion(tree.tags)};`,
    `        actions:  ${setToUnion(tree.actions)};`,
    `        delays:   ${setToUnion(tree.delays)};`,
    `        guards:   ${setToUnion(tree.guards)};`,
    `      };`,
    `      pContext: ${pContextType};`,
    `    };`,
  ].join('\n');
};
