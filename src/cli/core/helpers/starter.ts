import { readFile, writeFile } from 'fs/promises';
import { basename, resolve } from 'path';
import { LIB } from '../constants';

const isMachineFile = (filePath: string) =>
  filePath.endsWith('.machine.ts') || filePath.endsWith('.fsm.ts');

const getMachineName = (filePath: string) => {
  const filename = basename(filePath);
  return filename.replace(/\.machine\.ts$|\.fsm\.ts$/i, '') || 'machine';
};

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

  const defaultName = getMachineName(filePath);
  const defaultContent = `import { createMachine } from '${LIB}';\n\nexport default createMachine('${defaultName}', { initial: 'idle', states: { idle: {} } })\n`;

  await writeFile(absolutePath, defaultContent, 'utf8');
  console.log(`Created starter machine file: ${filePath}`);
};
