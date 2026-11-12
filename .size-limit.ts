import { globSync } from 'fs';
import { join, relative, basename, dirname } from 'path';
import type { SizeLimitConfig } from 'size-limit';

const root = import.meta.dirname;
const limit = '10 kB';

const GLOBS = [
  'packages/*/lib/**/*.js',
  'packages/*/lib/**/*.d.ts',
  'packages/utils/*/lib/**/*.js',
  'packages/utils/*/lib/**/*.d.ts',
];

const files = GLOBS.map(g => globSync(join(root, g)))
  .flat()
  .sort()
  .map(abs => {
    const path = relative(root, abs);
    const name = `${dirname(path)}/${basename(path)}`;
    return { name, path, limit };
  }) satisfies SizeLimitConfig;

export default files satisfies SizeLimitConfig;
