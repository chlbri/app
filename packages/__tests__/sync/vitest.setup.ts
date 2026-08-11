import { beforeAll, vi } from 'vitest';

vi.spyOn(console, 'log').mockImplementation(() => {});

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
