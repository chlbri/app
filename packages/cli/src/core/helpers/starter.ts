import { readFile, writeFile } from 'fs/promises';
import { basename, resolve } from 'path';
import { LIB } from '../constants';

/**
 * Checks whether a given file path is a machine file (`.machine.ts` or `.fsm.ts`).
 *
 * @param filePath - File path string.
 *
 * @returns `true` if machine file, otherwise `false`.
 */
const isMachineFile = (filePath: string) =>
  filePath.endsWith('.machine.ts') || filePath.endsWith('.fsm.ts');

/**
 * Extracts default machine name from file path basename.
 *
 * @param filePath - File path string.
 *
 * @returns Extracted machine name string.
 */
const getMachineName = (filePath: string) => {
  const filename = basename(filePath);
  return filename.replace(/\.machine\.ts$|\.fsm\.ts$/i, '') || 'machine';
};

/**
 * Produces default starter code content for a machine file.
 *
 * @param filePath - Target machine file path.
 *
 * @returns Starter TypeScript code string.
 */
export const produceStarterContent = (filePath: string) => {
  const name = getMachineName(filePath);
  return `import { createMachine } from '${LIB}';

export default createMachine('${name}', { initial: 'idle', states: { idle: {} } })
`;
};

/**
 * Creates starter file content if the specified machine file is newly created and empty.
 *
 * @param filePath - Target machine file path.
 * @param cwd - Working directory (defaults to process.cwd()).
 */
export const createStarter = async (
  filePath: string,
  cwd = process.cwd(),
) => {
  if (!isMachineFile(filePath)) return;

  const absolutePath = resolve(cwd, filePath);
  let existing = '';

  try {
    existing = await readFile(absolutePath, 'utf8');
  } catch (err: any) {
    if (err?.code !== 'ENOENT') {
      console.error(`Failed to inspect created file ${filePath}:`, err);
    }
    return;
  }

  if (existing.trim().length > 0) return;
  const defaultContent = produceStarterContent(filePath);
  await writeFile(absolutePath, defaultContent, 'utf8');
  console.log(`Created starter machine file: ${filePath}`);
};
