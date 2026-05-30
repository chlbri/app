import { run } from 'cmd-ts';
import { cli } from './cli';

run(cli, [
  'generate',
  // '-c',
  // 'src/cli/__tests__',
  '-o',
  './src/cli/__tests__/app.gen.ts',
  '--dry-run',
]);
