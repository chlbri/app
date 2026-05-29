import { type Component, type ComponentProps } from 'solid-js';
import type { RC } from '~ui/types';

export const reduceComponent = <
  const T extends Component<any>,
  K extends Partial<ComponentProps<T>> = never,
  Keys extends keyof ComponentProps<T> =
    keyof K extends keyof ComponentProps<T> ? keyof K : never,
>(
  Compt: T,
  props1?: K,
) => {
  const out: RC<T, Keys> = props2 => {
    const props = { ...props1, ...props2 };
    return Compt(props);
  };

  return out;
};
