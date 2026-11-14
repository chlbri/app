import { run } from 'cmd-ts';
import fg from 'fast-glob';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { CONTRACT_LIB, LIB } from '../core/constants';
import { generate } from './generate';

const MACHINE_CONTENT = `import { createMachine } from '${LIB}';

export default createMachine('sample-machine', {
  initial: 'idle',
  states: { idle: {} },
});
`;

const CONTRACT_CONTENT = `import { createContract } from '${CONTRACT_LIB}';

export default createContract('sample-contract', {
  initial: 'idle',
  states: { idle: {} },
});
`;

describe('#01 => generate', () => {
  let dir: string;

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), 'app-cli-contract-'));
    writeFileSync(join(dir, 'sample.machine.ts'), MACHINE_CONTENT);
    writeFileSync(join(dir, 'sample.contract.ts'), CONTRACT_CONTENT);
  });

  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  const dryRun = async (args: string[] = []) => {
    const result = await run(generate, ['-c', dir, '--dry-run', ...args]);
    return (result as string[]).join('\n');
  };

  test('#01 => ignores contract files by default', async () => {
    const content = await dryRun();

    expect(content).toContain("declare module '@bemedev/app'");
    expect(content).toContain("'sample-machine'");
    expect(content).not.toContain("'sample-contract'");
  });

  test('#02 => generates contract files only with --contract', async () => {
    const content = await dryRun(['--contract']);

    expect(content).toContain("declare module '@bemedev/app-contract'");
    expect(content).toContain("'sample-contract'");
    expect(content).not.toContain("'sample-machine'");
  });

  test('#03 => writes machine types to app.gen.ts', async () => {
    await run(generate, ['-c', dir]);

    expect(existsSync(join(dir, 'app.gen.ts'))).toBe(true);
    expect(existsSync(join(dir, 'app.contract.gen.ts'))).toBe(false);
  });

  test('#04 => writes contract types to app.contract.gen.ts', async () => {
    await run(generate, ['-c', dir, '--contract']);

    expect(existsSync(join(dir, 'app.contract.gen.ts'))).toBe(true);
  });
});

describe('#02 => stale discovery', () => {
  test('#01 => skips files removed between discovery and parsing', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'app-cli-stale-'));
    const kept = join(dir, 'kept.machine.ts');
    const ghost = join(dir, 'ghost.machine.ts');
    writeFileSync(kept, MACHINE_CONTENT);

    /** Simulates a file deleted after `fast-glob` listed it (watch mode) */
    const glob = vi.spyOn(fg, 'async');
    glob.mockResolvedValueOnce([kept, ghost]);

    try {
      const result = await run(generate, ['-c', dir, '--dry-run']);
      const content = (result as string[]).join('\n');

      expect(content).toContain("'sample-machine'");
      expect(content).not.toContain("'ghost'");
    } finally {
      glob.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
