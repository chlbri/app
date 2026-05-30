import { array, command, multioption, option, string } from 'cmd-ts';
import nodeWatch from 'node-watch';
import { DEFAULT_EXCLUDES, DEFAULT_REGEX } from '../core/constants';
import { generator } from '../core/generator';
import { createStarter } from '../core/helpers/starter';

/**
 * CLI command: `app watch`
 *
 * Long-running file system watcher that monitors machine files and regenerates
 * app.gen.ts automatically on any change.
 *
 * Behavior:
 * 1. **Initial generation**: Performs full generation on startup
 * 2. **Watch phase**: Monitors all *.machine.ts and *.fsm.ts files for changes
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
 * - `--output, -o [path]` - Where to write app.gen.ts (default: 'app.gen.ts')
 * - `--excludes, -e [patterns...]` - Glob patterns to exclude (default: node_modules, dist, lib)
 *
 * **Usage Examples:**
 * ```bash
 * # Start watching
 * pnpm run generate:watch
 *
 * # Custom output
 * app watch --output lib/app.gen.ts
 *
 * # Exclude additional directories
 * app watch --excludes temp build
 *
 * # Run alongside dev server
 * pnpm run dev &
 * pnpm run generate:watch
 * ```
 *
 * **Important Notes:**
 * - Runs indefinitely until Ctrl+C is pressed
 * - Handles file stabilization with 300ms threshold via Chokidar `awaitWriteFinish`
 * - Automatically scaffolds a new `.machine.ts` / `.fsm.ts` file with
 *   `export default createMachine('name', { initial: 'idle', states: { idle: {} } })`
 *   when the file is created and initially empty
 * - Ignores changes in excluded directories and output file itself
 * - Logs are written to stderr for script integration
 *
 * @see {@link generator} for the underlying generation logic
 * @see {@link DEFAULT_EXCLUDES} for default ignored directories
 *
 * @see
 *
 * <br/>
 *
 * [node-watch](https://www.npmjs.com/package/node-watch) documentation for handling file change events and debouncing
 *
 * [cmd-ts](https://www.npmjs.com/package/cmd-ts) documentation for defining CLI commands and arguments
 *
 * [ts-morph](https://www.npmjs.com/package/ts-morph) documentation for programmatically creating starter machine files when new machine files are added
 *
 * Uses libs like `node-watch` for efficient file watching and `cmd-ts` for CLI argument parsing.
 */
export const watch = command({
  name: 'watch',
  description:
    'Watch *.machine.ts / *.fsm.ts files and regenerate app.gen.ts on change',
  aliases: ['dev'],
  args: {
    excludes: multioption({
      type: array(string),
      long: 'excludes',
      short: 'e',
      defaultValue: () => DEFAULT_EXCLUDES,
      description: 'Directories to exclude',
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
        await createStarter(path);
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
