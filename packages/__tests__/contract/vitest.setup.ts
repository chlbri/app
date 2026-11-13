import { beforeAll, vi } from 'vite-plus/test';

vi.spyOn(console, 'log').mockImplementation(() => {});

beforeAll(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
