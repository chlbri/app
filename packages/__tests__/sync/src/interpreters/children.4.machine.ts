import { createMachine } from '@bemedev/app';

export default createMachine(
  'src/__tests__/interpreters/children.4.machine',
  {
    initial: 'active',
    states: {
      active: { on: { NEXT: '/inactive' } },
      inactive: { on: { NEXT: '/active' } },
    },
  },
  { sync: true },
);
