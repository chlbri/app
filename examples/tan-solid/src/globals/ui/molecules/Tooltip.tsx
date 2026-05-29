import { type Component } from 'solid-js';
import { cn } from '../cn/utils';
import { useHook } from './Tooltip.hook';
import type { ToolTipProps } from './Tooltip.types';

export const ToolTip: Component<ToolTipProps> = props => {
  const { isVisible, positionClass, setContainerRef, handlers, local } =
    useHook(props);

  return (
    <div
      {...local}
      ref={setContainerRef}
      class={cn('relative', local.class)}
      {...handlers}
    >
      {props.children}
      <div
        class={cn(
          'absolute z-50 px-2 py-1 text-sm text-white bg-black rounded-md shadow-lg whitespace-nowrap transition-opacity duration-200',
          positionClass(),
          isVisible()
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
      >
        {props.tooltip}
      </div>
    </div>
  );
};
