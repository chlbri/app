import { flatMap, type NodeConfig2 } from '#states';
import { toArray } from '@bemedev/app-utils-bemedev';

export const getTags = <T extends string = string>(node: NodeConfig2) => {
  const flat = flatMap(node);
  const out: string[] = [];
  const entries = Object.entries(flat);

  entries.forEach(([, state]) => {
    const tags = toArray.typed(state.tags);
    out.push(...tags);
  });

  const checkEmpty = out.length === 0;
  if (checkEmpty) return undefined;

  return out as T[];
};
