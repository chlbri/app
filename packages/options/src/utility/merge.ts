import type { UtilityPlugin } from './plugin';
import type { UtilityMap } from './types';

/**
 * Name of a utility reserved by the builder itself.
 */
const RESERVED_NAMES = new Set(['resolve']);

/**
 * Merges a descriptor map into another one.
 *
 * Duplicate keys throw by default: a plugin must opt in with `override: true`
 * to replace an existing utility.
 *
 * @param target - Map mutated in place.
 * @param source - Utilities to merge.
 * @param options - Merge policy and diagnostic labels.
 * @param options.override - Set to `true` to replace existing keys.
 * @param options.plugin - Plugin name added to diagnostic messages.
 *
 * @returns The mutated target map.
 */
export const mergeUtilities = (
  target: UtilityMap,
  source: UtilityMap,
  options: { override?: boolean; plugin?: string } = {},
) => {
  const { override = false, plugin } = options;
  const origin = plugin ? ` from plugin "${plugin}"` : '';

  for (const [name, descriptor] of Object.entries(source)) {
    if (RESERVED_NAMES.has(name)) {
      throw new Error(`Utility "${name}" is reserved${origin}`);
    }

    if (Object.hasOwn(target, name) && !override) {
      throw new Error(
        `Utility "${name}" already exists${origin}. ` +
          'Set "override: true" on the plugin to replace it.',
      );
    }

    target[name] = descriptor;
  }

  return target;
};

/**
 * Merges global and per-call plugins, per-call plugins winning on shared
 * names.
 *
 * @param globals - Registered plugins.
 * @param locals - Per-call plugins.
 *
 * @returns The effective plugin list.
 */
export const mergePlugins = (
  globals: readonly UtilityPlugin<any, any>[],
  locals: readonly UtilityPlugin<any, any>[],
) => {
  if (globals.length === 0) return [...locals];

  const byName = new Map<string, UtilityPlugin<any, any>>();

  for (const plugin of globals) byName.set(plugin.name, plugin);
  for (const plugin of locals) byName.set(plugin.name, plugin);

  return [...byName.values()];
};

/**
 * Orders plugins by their `requires` declarations.
 *
 * Duplicate names keep the first occurrence, already-applied plugins are
 * skipped, missing dependencies and cycles throw a descriptive error, and the
 * input order is preserved whenever no constraint applies.
 *
 * @template `P` - Plugin type to order.
 *
 * @param plugins - Plugins to order.
 * @param applied - Names already applied before this call.
 *
 * @returns Plugins ready to be applied in order.
 */
export const orderPlugins = <P extends UtilityPlugin<any, any>>(
  plugins: readonly P[],
  applied: ReadonlySet<string> = new Set<string>(),
) => {
  const byName = new Map<string, P>();

  for (const plugin of plugins) {
    if (!byName.has(plugin.name)) byName.set(plugin.name, plugin);
  }

  const ordered: P[] = [];
  const states = new Map<string, 'visiting' | 'done'>();

  const visit = (plugin: P, path: readonly string[]) => {
    if (applied.has(plugin.name)) return;

    const state = states.get(plugin.name);

    if (state === 'done') return;

    if (state === 'visiting') {
      throw new Error(
        `Circular plugin dependency: ${[...path, plugin.name].join(' -> ')}`,
      );
    }

    states.set(plugin.name, 'visiting');

    for (const dependency of plugin.requires ?? []) {
      if (applied.has(dependency) || states.get(dependency) === 'done') {
        continue;
      }

      const required = byName.get(dependency);

      if (!required) {
        throw new Error(
          `Plugin "${plugin.name}" requires "${dependency}", which is not provided.`,
        );
      }

      visit(required, [...path, plugin.name]);
    }

    states.set(plugin.name, 'done');
    ordered.push(plugin);
  };

  for (const plugin of byName.values()) visit(plugin, []);

  return ordered;
};
