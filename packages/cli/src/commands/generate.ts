import { array, command, flag, multioption, option, string } from 'cmd-ts';
import { generator as handler } from '../core/generator';

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
 * Contract files (`*.contract.ts`) are handled by a separate pass: pass
 * `--contract` to generate types for contract files **instead of** machines.
 * Contract types are written to `app.contract.gen.ts`.
 *
 * This command is useful for:
 * - Initial type generation after creating new machines
 * - Regenerating types after major config changes
 * - Integration into CI/CD pipelines
 * - One-shot validation of machine type correctness
 *
 * **Arguments:**
 * - `--excludes, -e [patterns...]` - Glob patterns to exclude (default: node_modules, dist, lib)
 * - `--contract` - Generate types for `*.contract.ts` files instead of machine files (writes `app.contract.gen.ts`)
 * - `--dry-run, -d` - Print output to stdout without writing file (useful for inspection)
 * - `--cwd, -c [path]` - Directory where the glob pattern is applied (default: current working directory)
 *
 * **Usage Examples:**
 * ```bash
 * # Default generation
 * pnpm run generate
 *
 * # Custom working directory
 * app generate --cwd ./packages/app
 *
 * # Exclude additional directories
 * app generate --excludes temp build
 *
 * # Generate contract types only, into app.contract.gen.ts
 * app generate --contract
 *
 * # Dry-run to inspect output
 * app generate --dry-run | less
 * ```
 *
 * @see {@linkcode handler} for the underlying generation logic
 */
export const generate = command({
  name: 'generate',
  description:
    'Generate app.gen.ts from all *.machine.ts / *.fsm.ts files (use --contract for app.contract.gen.ts from *.contract.ts only)',
  args: {
    excludes: multioption({
      type: array(string),
      long: 'excludes',
      short: 'e',
      // defaultValue: () => DEFAULT_EXCLUDES,
      description: 'Directories to exclude',
    }),

    contract: flag({
      long: 'contract',
      description:
        'Generate types for *.contract.ts files into app.contract.gen.ts instead of machine files',
    }),

    dryRun: flag({
      long: 'dry-run',
      short: 'd',
      description:
        'Print output and returns array contents without writing to file (useful for inspection)',
    }),

    cwd: option({
      // #region Too much to handle for vitest
      /* v8 ignore start -- @preserve */
      defaultValue: () => process.cwd(),
      /* v8 ignore stop -- @preserve */
      // #endregion

      type: string,
      long: 'cwd',
      short: 'c',

      description:
        'The directory where to search files (defaults to current working directory). N.B: Not the ts root directory, but the directory where the glob pattern will be applied.',
    }),
  },
  handler,
});
