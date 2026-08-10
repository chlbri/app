import { subcommands } from 'cmd-ts';
import { generate } from './commands/generate';
import { watch } from './commands/watch';
import { BIN, LIB } from './core/constants';

/**
 * Main CLI entry point defining subcommands for type generation and file watching.
 */
export const cli = subcommands({
  name: BIN,
  description: `CLI tool for ${LIB} type generation`,
  cmds: { generate, watch },
});
