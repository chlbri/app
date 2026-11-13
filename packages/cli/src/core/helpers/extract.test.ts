import { Project } from 'ts-morph';
import { extractMachineInfo } from './extract';

const createProject = () => new Project({ useInMemoryFileSystem: true });

describe('#01 => extractMachineInfo', () => {
  test('#01 => extracts a createMachine call', () => {
    const project = createProject();
    const path = '/virtual/sample.machine.ts';

    project.createSourceFile(
      path,
      `import { createMachine } from '@bemedev/app';
export default createMachine('sample', {
  initial: 'idle',
  states: { idle: {} },
});
`,
    );

    expect(extractMachineInfo(path, project)).toEqual({
      name: 'sample',
      config: { initial: 'idle', states: { idle: {} } },
      pContextType: 'any',
    });
  });

  test('#02 => extracts a createContract call', () => {
    const project = createProject();
    const path = '/virtual/sample.contract.ts';

    project.createSourceFile(
      path,
      `import { createContract } from '@bemedev/app-contract';
export default createContract(
  'sample',
  { initial: 'idle', states: { idle: {} } },
  { pContext: type({ count: 'number' }) },
);
`,
    );

    expect(extractMachineInfo(path, project)).toEqual({
      name: 'sample',
      config: { initial: 'idle', states: { idle: {} } },
      pContextType: '{ count: number }',
    });
  });

  test('#03 => ignores unrelated factory calls', () => {
    const project = createProject();
    const path = '/virtual/sample.ts';

    project.createSourceFile(
      path,
      `export default somethingElse('sample', { initial: 'idle', states: {} });`,
    );

    expect(extractMachineInfo(path, project)).toBeNull();
  });
});
