import { createSignal, type Accessor, type Setter } from 'solid-js';

export function createDebounce<T>(action: (arg: T) => void, ms = 1000) {
  let timerHandle: NodeJS.Timeout;

  const debounce = (value: T) => {
    clearTimeout(timerHandle);
    timerHandle = setTimeout(() => action(value), ms);
  };
  debounce.cancel = () => clearTimeout(timerHandle);

  return debounce;
}

type Options<T> = {
  ms?: number;
  action?: (value: T) => void;
  end?: T;
};

export function createDebounceSignal<T>(
  start: T,
  options: Omit<Options<T>, 'end'> & Required<Pick<Options<T>, 'end'>>,
): readonly [
  Accessor<T>,
  {
    (): void;
    cancel: () => void;
  },
];
export function createDebounceSignal<T>(
  start: T,
  options?: Omit<Options<T>, 'end'>,
): readonly [
  Accessor<T>,
  {
    (value: T): void;
    cancel: () => void;
  },
  setter: Setter<T>,
];

export function createDebounceSignal<T>(start: T, options?: Options<T>) {
  const { ms = 500, action, end } = options ?? {};
  const [signal, _setSignal] = createSignal(start);

  const setSignal = (value: T) => {
    if (action) {
      action(value);
    }

    _setSignal(value as any);
  };

  const debounce = createDebounce<T>(setSignal, ms);

  if (end) {
    const debounce2 = () => {
      setSignal(end as any);
      debounce(start);
    };
    debounce2.cancel = debounce.cancel;

    return [signal, debounce2] as any;
  }

  return [signal, debounce, setSignal] as any;
}

export const cds = createDebounceSignal;

export const toggleDebounceBool = (
  args?: { initial?: boolean } & Omit<Options<boolean>, 'end'>,
) => {
  const { ms = 500, initial = true, action } = args ?? {};
  return cds(initial, { ms, end: !initial, action });
};
