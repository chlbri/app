import { flatMap, type NodeConfig2 } from '#states';
import { toArray } from '@bemedev/app-utils-bemedev';

export const getTags = <T extends string = string>(
  node: NodeConfig2,
): T[] => {
  const flat = flatMap(node);
  const out = new Set<string>();
  const entries = Object.entries(flat);

  entries.forEach(([, state]) => {
    const tags = toArray.typed(state.tags);
    tags.forEach(tag => out.add(tag));
  });

  return Array.from(out) as T[];
};
