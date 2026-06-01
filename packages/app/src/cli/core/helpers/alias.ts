import { readFileSync } from 'fs';
import { resolve } from 'path';

export const getPathAliasesFromTsConfig = (): Record<string, string> => {
  try {
    const tsconfigPath = resolve(process.cwd(), 'tsconfig.json');
    const tsconfigContent = readFileSync(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);

    const paths = tsconfig.compilerOptions?.paths ?? {};
    const aliases: Record<string, string> = {};

    for (const [alias, pathArray] of Object.entries(paths)) {
      if (Array.isArray(pathArray) && pathArray.length > 0) {
        const fullPath = pathArray[0] as string;
        // Extract the folder name from paths like "./src/types/index.ts" -> "types"
        // or "./src/common/*" -> "common"
        const match = fullPath.match(/\/src\/([^/]+)/);
        if (match) {
          aliases[alias] = match[1];
        }
      }
    }

    return aliases;
  } catch (err) {
    console.warn('Error reading PATH_ALIASES from tsconfig.json:', err);
    // Fallback to hardcoded defaults
    return {};
  }
};
