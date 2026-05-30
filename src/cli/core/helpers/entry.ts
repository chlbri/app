import type { ConfigPaths } from '#utils';

const setToUnion = (set: any): string => {
  const values: string[] = [];
  for (const v of set) {
    values.push(v);
  }

  if (values.length === 0) return 'never';
  return values.map(v => `'${v}'`).join(' | ');
};

const pathsToUnion = (paths: string[]): string => {
  if (paths.length === 0) return 'never';
  return paths.map(p => `'${p}'`).join(' | ');
};

const configPathsToType = (cp: ConfigPaths, indent = 0): string => {
  const pad = ' '.repeat(indent);
  const nextPad = ' '.repeat(indent + 2);

  const targetUnion =
    cp.targets.length === 0
      ? 'never'
      : cp.targets.map(t => `'${t}'`).join(' | ');

  const lines: string[] = [`{ targets: (${targetUnion})[]; `];

  if (cp.initial) {
    lines.push(`${nextPad}initial?: '${cp.initial}';`);
  }

  if (cp.states && Object.keys(cp.states).length > 0) {
    lines.push(`${nextPad}states?: {`);

    for (const [stateName, stateConfig] of Object.entries(cp.states)) {
      const stateType = configPathsToType(stateConfig, indent + 4);
      lines.push(`${' '.repeat(indent + 4)}'${stateName}': ${stateType};`);
    }

    lines.push(`${nextPad}};`);
  }

  lines.push(`${pad}}`);

  return lines.join('\n');
};

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
    `      pContext?: ${pContextType};`,
    `      tags?: ${setToUnion(tree.tags)};`,
    `    };`,
  ].join('\n');
};
