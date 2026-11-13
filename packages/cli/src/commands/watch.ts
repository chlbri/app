import { array, command, flag, multioption, option, string } from 'cmd-ts';
import nodeWatch from 'node-watch';
import { DEFAULT_REGEX } from '../core/constants';
import { generator } from '../core/generator';
import { createStarter } from '../core/helpers/starter';
import { relative } from 'path';

/**
 * CLI command: `app watch`
 *
 * Long-running file system watcher that monitors machine files and regenerates
 * their type declaration file automatically on any change.
 *
 * Behavior:
 * 1. **Initial generation**: Performs full generation on startup
 * 2. **Watch phase**: Monitors all *.machine.ts, *.fsm.ts and *.contract.ts files
 *    for changes (generation itself stays exclusive: `--contract` regenerates
 *    contract types only into `app.contract.gen.ts`, otherwise machine types
 *    only into `app.gen.ts`)
 * 3. **Debounced regeneration**: Waits 300ms of stability before regenerating
 *    (handles editor save sequences and git checkouts gracefully)
 * 4. **Feedback**: Logs change detection and regeneration completion
 * 5. **Graceful shutdown**: Responds to Ctrl+C and closes watcher cleanly
 *
 * Ideal for development workflows:
 * - Automatic type updates as you modify machine configs
 * - Immediate IDE feedback (via generated types)
 * - No manual regeneration needed
 * - Works seamlessly with hot reload / dev servers
 *
 * **Arguments:**
 * - `--excludes, -e [patterns...]` - Glob patterns to exclude (default: node_modules, dist, lib)
 * - `--contract` - Generate types for `*.contract.ts` files instead of machine files (writes `app.contract.gen.ts`)
 * - `--cwd, -c [path]` - Directory where the glob pattern is applied (default: current working directory)
 *
 * **Usage Examples:**
 * ```bash
 * # Start watching
 * pnpm run generate:watch
 *
 * # Custom working directory
 * app watch --cwd ./packages/app
 *
 * # Exclude additional directories
 * app watch --excludes temp build
 *
 * # Generate contract types only, into app.contract.gen.ts
 * app watch --contract
 *
 * # Run alongside dev server
 * pnpm run dev &
 * pnpm run generate:watch
 * ```
 *
 * **Important Notes:**
 * - Runs indefinitely until Ctrl+C is pressed
 * - Handles file stabilization with a 300ms debounce applied to change events
 * - Automatically scaffolds a new `.machine.ts` / `.fsm.ts` / `.contract.ts` file
 *   with
 *   `export default createMachine('name', { initial: 'idle', states: { idle: {} } })`
 *   when the file is created and initially empty
 * - Ignores changes in excluded directories and output file itself
 * - Logs are written to stderr for script integration
 *
 * @see [node-watch](https://www.npmjs.com/package/node-watch) for file change
 * events, [cmd-ts](https://www.npmjs.com/package/cmd-ts) for CLI arguments and
 * [ts-morph](https://www.npmjs.com/package/ts-morph) for starter machine files
 */
export const watch = command({
  name: 'watch',
  description:
    'Watch *.machine.ts / *.fsm.ts files and regenerate app.gen.ts on change (use --contract for app.contract.gen.ts from *.contract.ts only)',
  aliases: ['dev'],
  args: {
    excludes: multioption({
      type: array(string),
      long: 'excludes',
      short: 'e',
      description: 'Directories to exclude',
    }),

    contract: flag({
      long: 'contract',
      description:
        'Generate types for *.contract.ts files into app.contract.gen.ts instead of machine files',
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
  handler: async options => {
    const generate = () => generator(options);

    /** Initial generation */
    await generate();

    const watcher2 = nodeWatch(options.cwd, {
      recursive: true,
      delay: 300,
      filter: DEFAULT_REGEX,
    }).on('change', async (event, path) => {
      /* v8 ignore start -- @preserve */
      if (typeof path !== 'string') return;
      /* v8 ignore stop -- @preserve */

      if (event === 'update') {
        console.warn('path', '=>', path);
        const relativePath = relative(options.cwd, path);
        await createStarter(relativePath, options.cwd);
        return generate();
      } else {
        console.log(`\nChange detected: ${path}`);
        return generate();
      }
    });

    console.log(`\nWatching for changes in ${options.cwd}...`);
    console.log('Press Ctrl+C to stop.\n');

    // Keep process alive
    /* v8 ignore start -- @preserve */
    process.on('SIGINT', async () => {
      watcher2.close();
      process.exit(0);
    });
    /* v8 ignore stop -- @preserve */

    return watcher2;
  },
});
