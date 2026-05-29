import { createEffect, onCleanup, type Accessor } from 'solid-js';
import { buildBoolean } from '../helpers';

type Options = {
  delay?: number;
  start?: Accessor<boolean | undefined> | boolean;
};

export const createInterval = (callback: () => void, delay = 3000) => {
  let interval: NodeJS.Timeout;

  const start = (condition?: Options['start']) => {
    const _condition = buildBoolean(condition);
    if (!_condition) return stop();
    interval = setInterval(() => {
      callback();
    }, delay);
  };

  const stop = (condition?: Options['start']) => {
    const _condition = buildBoolean(condition);
    if (!_condition) return;
    if (interval) clearInterval(interval);
  };

  onCleanup(stop);
  return { start, stop };
};

createInterval.auto = (callback: () => void, options: Options = {}) => {
  const { start } = createInterval(callback, options.delay);
  createEffect(() => start(options.start));
};
