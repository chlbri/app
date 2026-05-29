import { createSignal } from 'solid-js';

export const [toFocus, setFocus] = createSignal<string | undefined>(
  undefined,
);
