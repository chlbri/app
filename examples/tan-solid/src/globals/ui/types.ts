import type {
  Component,
  ComponentProps,
  JSX,
  ValidComponent,
} from 'solid-js';

export type PropsOf<
  T extends ValidComponent,
  K extends keyof ComponentProps<T> = never,
> = Pick<ComponentProps<T>, K>;

export type OmitPropsOf<
  T extends ValidComponent,
  K extends keyof ComponentProps<T> = never,
> = Omit<ComponentProps<T>, K>;

export type ReduceComponent<
  T extends ValidComponent,
  K extends keyof ComponentProps<T> = never,
> = Component<OmitPropsOf<T, K> & Partial<PropsOf<T, K>>>;

export type RC<
  T extends ValidComponent,
  K extends keyof ComponentProps<T> = never,
> = ReduceComponent<T, K>;

export type PickComponent<
  T extends ValidComponent,
  K extends keyof ComponentProps<T> = never,
> = Component<PropsOf<T, K>>;

export type PiC<
  T extends ValidComponent,
  K extends keyof ComponentProps<T> = never,
> = PickComponent<T, K>;

export type RootLink = JSX.HTMLElementTags['link'];
