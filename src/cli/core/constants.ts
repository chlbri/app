export const BIN = 'app-cli';
export const DEFAULT_OUTPUT = 'app.gen.ts';
export const MACHINE_GLOB = '**/*.{machine,fsm}.ts';
export const DEFAULT_EXCLUDES = [
  'node_modules/**',
  'lib/**',
  'dist/**',
  'temp/**',
];
export const LIB = '@bemedev/app';
export const END_WITHS = ['.machine.ts', '.fsm.ts'];
export const DEFAULT_REGEX = /(?:\.machine\.ts|\.fsm\.ts)$/;
