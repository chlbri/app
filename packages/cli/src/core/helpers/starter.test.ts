import { DEFAULT_REGEX, END_WITHS } from '../constants';
import { produceStarterContent } from './starter';

describe('#01 => produceStarterContent', () => {
  test('#01 => scaffolds a machine file', () => {
    const content = produceStarterContent('auth.machine.ts');

    expect(content).toContain("import { createMachine } from '@bemedev/app';");
    expect(content).toContain("createMachine('auth'");
  });

  test('#02 => scaffolds a contract file', () => {
    const content = produceStarterContent('auth.contract.ts');

    expect(content).toContain(
      "import { createContract } from '@bemedev/app-contract';",
    );
    expect(content).toContain("createContract('auth'");
  });
});

describe('#02 => contract discovery', () => {
  test('#01 => contract files are supported', () => {
    expect(END_WITHS).toContain('.contract.ts');
    expect(DEFAULT_REGEX.test('auth.contract.ts')).toBe(true);
  });
});
