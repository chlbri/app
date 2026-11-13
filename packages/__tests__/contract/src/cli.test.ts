import { execFileSync } from 'child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const SOURCE = resolve('src/auth.contract.ts');

const MACHINE_CONTENT = `import { createMachine } from '@bemedev/app';

export default createMachine('sample-machine', {
  initial: 'idle',
  states: { idle: {} },
});
`;

const BIN = [
  resolve('node_modules/.bin/app-cli'),
  resolve('../../../node_modules/.bin/app-cli'),
].find(existsSync);

const cli = (args: string[]) => {
  if (!BIN) throw new Error('app-cli binary not found');

  return execFileSync(BIN, args, { encoding: 'utf8' });
};

describe('#01 => app-cli generate', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'app-cli-contract-'));
    cpSync(SOURCE, join(dir, 'auth.contract.ts'));
  });

  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  test('#01 => generates nothing for *.contract.ts without --contract', () => {
    cli(['generate', '-c', dir]);

    expect(existsSync(join(dir, 'app.gen.ts'))).toBe(false);
    expect(existsSync(join(dir, 'app.contract.gen.ts'))).toBe(false);
  });

  test('#02 => excludes contracts from machine generation', () => {
    writeFileSync(join(dir, 'sample.machine.ts'), MACHINE_CONTENT);
    cli(['generate', '-c', dir]);

    const content = readFileSync(join(dir, 'app.gen.ts'), 'utf8');

    expect(content).toContain('sample-machine');
    expect(content).not.toMatch(/\bauth'?\s*:/);
    expect(existsSync(join(dir, 'app.contract.gen.ts'))).toBe(false);
  });

  test('#03 => generates app.contract.gen.ts with --contract', () => {
    cli(['generate', '-c', dir, '--contract']);

    const output = join(dir, 'app.contract.gen.ts');
    expect(existsSync(output)).toBe(true);
    expect(existsSync(join(dir, 'app.gen.ts'))).toBe(false);

    const content = readFileSync(output, 'utf8');
    expect(content).toContain("declare module '@bemedev/app-contract'");
    expect(content).toMatch(/\bauth'?\s*:/);
  });
});

describe('#02 => committed generated file', () => {
  const content = readFileSync(resolve('src/app.contract.gen.ts'), 'utf8');

  test('#01 => targets the contract register', () => {
    expect(content).toContain("declare module '@bemedev/app-contract'");
    expect(content).toMatch(/\bauth'?\s*:/);
  });

  test('#02 => emits the registered typing surface', () => {
    expect(content).toContain("events: 'LOGIN'");
    expect(content).toContain('pContext: { token: string }');
  });
});
