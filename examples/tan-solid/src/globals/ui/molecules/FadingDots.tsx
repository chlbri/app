import { splitProps, type Component, JSX } from 'solid-js';
import type { OmitPropsOf } from '../types';
import { cn } from '../cn/utils';

export const FadingDots: Component<{
  count: number;
  duration?: number;
  innerProps?: OmitPropsOf<'span', 'children' | 'style'> & {
    style?: JSX.CSSProperties;
  };
}> = ({ count: length, innerProps = {}, duration = 500 }) => {
  const [local, rest] = splitProps(innerProps, ['class', 'style']);

  return (
    <div class='flex items-center justify-center space-x-4 mt-4'>
      {Array.from({ length }, (_, i) => (
        <span
          class={cn(
            'rounded-full animate-out direction-alternate repeat-infinite fade-out-5 size-4  bg-gray-600',
            local.class,
          )}
          style={{
            ...local.style,
            'animation-duration': `${duration}ms`,
            'animation-delay': `${duration / i}ms`,
          }}
          aria-hidden='true'
          {...rest}
        />
      ))}
    </div>
  );
};
