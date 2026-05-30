import { array, command, flag, multioption, option, string } from 'cmd-ts';
import { DEFAULT_EXCLUDES, DEFAULT_OUTPUT } from '../core/constants';
import { generator } from '../core/generator';

/**
 * CLI command: `app generate`
 *
 * One-time generation of app.gen.ts from all discovered machine files.
 *
 * Scans the project for all *.machine.ts and *.fsm.ts files, extracts their
 * TypeScript configurations and type definitions, and generates a consolidated
 * app.gen.ts module declaration containing the full Register interface with
 * inlined type information for every machine.
 *
 * This command is useful for:
 * - Initial type generation after creating new machines
 * - Regenerating types after major config changes
 * - Integration into CI/CD pipelines
 * - One-shot validation of machine type correctness
 *
 * **Arguments:**
 * - `--output, -o [path]` - Where to write app.gen.ts (default: 'app.gen.ts')
 * - `--excludes, -e [patterns...]` - Glob patterns to exclude (default: node_modules, dist, lib)
 * - `--dry-run` - Print output to stdout without writing file (useful for inspection)
 *
 * **Usage Examples:**
 * ```bash
 * # Default generation
 * pnpm run generate
 *
 * # Custom output path
 * app generate --output lib/app.gen.ts
 *
 * # Exclude additional directories
 * app generate --excludes temp build
 *
 * # Dry-run to inspect output
 * app generate --dry-run | less
 * ```
 *
 * @see {@link generator} for the underlying generation logic
 * @see {@link DEFAULT_EXCLUDES} for default ignored directories
 * @see {@link DEFAULT_OUTPUT} for default output file path
 */
export const generate = command({
  name: 'generate',
  description:
    'Generate app.gen.ts from all *.machine.ts / *.fsm.ts files',
  args: {
    output: option({
      type: string,
      long: 'output',
      short: 'o',
      defaultValue: () => DEFAULT_OUTPUT,
      description: 'Output file path (relative to project root)',
    }),

    excludes: multioption({
      type: array(string),
      long: 'excludes',
      short: 'e',
      defaultValue: () => DEFAULT_EXCLUDES,
      description: 'Directories to exclude',
    }),

    dryRun: flag({
      long: 'dry-run',
      description: 'Print output without writing to file',
    }),
  },
  handler: async ({ output, excludes, dryRun }) => {
    return generator({ output, excludes, dryRun });
  },
});
