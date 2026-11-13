/** Name of the CLI binary command. */
export const BIN = 'app-cli';

/** Default output file name for generated machine type declarations. */
export const DEFAULT_OUTPUT = 'app.gen.ts';

/** Output file name for generated contract type declarations. */
export const CONTRACT_OUTPUT = 'app.contract.gen.ts';

/** Glob pattern to match machine and finite state machine source files. */
export const MACHINE_GLOB = '**/*.{machine,fsm}.ts';

/** Glob pattern to match contract source files (opt-in via `--contract`). */
export const CONTRACT_GLOB = '**/*.contract.ts';

/** Default directory glob patterns to exclude from scanning. */
export const DEFAULT_EXCLUDES = ['node_modules/**', 'lib/**', 'dist/**', 'temp/**'];

/** Core library package name. */
export const LIB = '@bemedev/app';

/** Contract library package name. */
export const CONTRACT_LIB = '@bemedev/app-contract';

/** Supported machine file extension suffixes. */
export const END_WITHS = ['.machine.ts', '.fsm.ts', '.contract.ts'];

/** Contract source file suffix. */
export const CONTRACT_SUFFIX = '.contract.ts';

/** Regular expression for matching machine, finite state machine and contract file extensions. */
export const DEFAULT_REGEX = /(?:\.machine\.ts|\.fsm\.ts|\.contract\.ts)$/;
