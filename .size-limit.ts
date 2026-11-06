import { globSync } from 'fs';
import { join, relative, basename, dirname } from 'path';
import type { SizeLimitConfig } from 'size-limit';

const root = import.meta.dirname;
const limit = '10 kB';

const files = [
  ...globSync(join(root, 'packages/*/lib/**/*.js')),
  ...globSync(join(root, 'packages/*/lib/**/*.d.ts')),
  ...globSync(join(root, 'packages/utils/*/lib/**/*.js')),
  ...globSync(join(root, 'packages/utils/*/lib/**/*.d.ts')),
].sort();

export default files.map(abs => {
  const path = relative(root, abs);
  const name = `${dirname(path)}/${basename(path)}`;
  return { name, path, limit };
}) satisfies SizeLimitConfig;
