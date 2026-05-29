import { splitProps } from 'solid-js';
import type { OmitPropsOf } from '../types';
import { cn } from '../cn/utils';

type Props<T extends string[]> = {
  texts: T;
  props?: {
    [K in Extract<keyof T, `${number}`>]?: OmitPropsOf<'span', 'children'>;
  };
} & OmitPropsOf<'span', 'children'>;

export function MultiText<const T extends string[]>({
  texts,
  props: _props,
  ...rest
}: Props<T>) {
  const [local, all] = splitProps(rest, ['class']);

  return (
    <span {...all} class={cn('inline!', local.class)}>
      {texts.map((text, index) => {
        const props = { ...(_props as any)?.[index] };
        return <span {...props}>{text}</span>;
      })}
    </span>
  );
}
