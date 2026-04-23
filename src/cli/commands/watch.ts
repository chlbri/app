import { watch as chokidarWatch } from 'chokidar';
import { array, command, multioption, option, string } from 'cmd-ts';
import {
  DEFAULT_EXCLUDES,
  DEFAULT_OUTPUT,
  MACHINE_GLOB,
} from '../core/constants';
import { generateAppGen } from '../core/generator';

/**
 * CLI command: `app-ts watch`
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
 * app-ts watch --output lib/app.gen.ts
 *
 * # Exclude additional directories
 * app-ts watch --excludes temp build
 *
 * # Run alongside dev server
 * pnpm run dev &
 * pnpm run generate:watch
 * ```
 *
 * **Important Notes:**
 * - Runs indefinitely until Ctrl+C is pressed
 * - Handles file stabilization with 300ms threshold
 * - Ignores changes in excluded directories and output file itself
 * - Logs are written to stderr for script integration
 *
 * @type {Command}
 * @see {@link generateAppGen} for the underlying generation logic
 * @see {@link MACHINE_GLOB} for the pattern of watched files
 */
export const watch = command({
  name: 'watch',
  description:
    'Watch *.machine.ts / *.fsm.ts files and regenerate app.gen.ts on change',
  aliases: ['dev'],
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
  },
  handler: async ({ output, excludes }) => {
    const cwd = process.cwd();

    // Initial generation
    await generateAppGen({ output, excludes, cwd });

    // Watch for changes
    const watcher = chokidarWatch(MACHINE_GLOB, {
      cwd,
      ignored: excludes.map(e => `${e}/**`),
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    });

    const regenerate = async (path: string) => {
      console.log(`\nChange detected: ${path}`);
      await generateAppGen({ output, excludes, cwd });
    };

    watcher
      .on('add', regenerate)
      .on('change', regenerate)
      .on('unlink', regenerate);

    console.log(`\nWatching for changes in ${MACHINE_GLOB}...`);
    console.log('Press Ctrl+C to stop.\n');

    // Keep process alive
    process.on('SIGINT', () => {
      watcher.close();
      process.exit(0);
    });
  },
});
