import { UserConfig } from 'vite-plus';

type Task = NonNullable<NonNullable<UserConfig['run']>['tasks']>[string];

export const pack: Task = {
  command: 'vp pack',
  dependsOn: [
    { task: 'pack', from: ['dependencies', 'devDependencies', 'peerDependencies'] },
  ],
  cache: {
    input: ['src/**', 'package.json', 'tsconfig.json', 'vite.config.ts'],
    output: ['lib/**'],
  },
};
