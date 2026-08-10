/** Name of the CLI binary command. */
export const BIN = 'app-cli';

/** Default output file name for generated type declarations. */
export const DEFAULT_OUTPUT = 'app.gen.ts';

/** Glob pattern to match machine and finite state machine source files. */
export const MACHINE_GLOB = '**/*.{machine,fsm}.ts';

/** Default directory glob patterns to exclude from scanning. */
export const DEFAULT_EXCLUDES = [
  'node_modules/**',
  'lib/**',
  'dist/**',
  'temp/**',
];

/** Core library package name. */
export const LIB = '@bemedev/app';

/** Supported machine file extension suffixes. */
export const END_WITHS = ['.machine.ts', '.fsm.ts'];

/** Regular expression for matching machine file extensions. */
export const DEFAULT_REGEX = /(?:\.machine\.ts|\.fsm\.ts)$/;
