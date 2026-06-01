import { sleep } from '@bemedev/sleep';
import type { ProcessEventMap } from 'process';

type RejectionHandler = (
  ...args: ProcessEventMap['unhandledRejection']
) => void;

export const unhandledRejection = async (
  testFn: () => any | Promise<any>,
  handler: RejectionHandler,
  timeout = 100,
) => {
  process.on('unhandledRejection', handler);
  process.on('uncaughtException', handler);

  try {
    testFn();
    await sleep(timeout);
  } catch (error) {
    handler(error, Promise.resolve());
  } finally {
    process.off('unhandledRejection', handler);
    process.off('uncaughtException', handler);
  }

  return handler;
};
