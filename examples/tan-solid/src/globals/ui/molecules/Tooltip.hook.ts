import { createMemo, createSignal, splitProps } from 'solid-js';
import type { ToolTipProps } from './Tooltip.types';
import { undefinedCall } from '../helpers';
import type { PropsOf } from '../types';
import { getPositionClass } from './Tooltip.helpers';

type PropsHandlers = PropsOf<
  'div',
  'onMouseOver' | 'onMouseOut' | 'onFocus' | 'onBlur'
>;

type ExtractFn<T extends keyof PropsHandlers> = (
  e: Parameters<Extract<PropsHandlers[T], (...args: any) => any>>[0],
) => any;

export const useHook = (
  props: Omit<ToolTipProps, 'children' | 'tooltip'>,
) => {
  let timeoutShow: ReturnType<typeof setTimeout>;
  let timeoutHide: ReturnType<typeof setTimeout>;
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();

  const [isVisible, setIsVisible] = createSignal(false);
  const [computedPosition, setComputedPosition] = createSignal<
    'top' | 'bottom'
  >('top');

  const position = props.position || 'viewport-relative';

  const showTooltip = () => {
    if (timeoutHide) clearTimeout(timeoutHide);
    const container = containerRef();

    // Calculate position for viewport-relative
    if (position === 'viewport-relative' && container) {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;

      // Default to top, but switch to bottom if not enough space above
      setComputedPosition(
        spaceAbove < 100 && spaceBelow > spaceAbove ? 'bottom' : 'top',
      );
    }

    timeoutShow = setTimeout(() => {
      setIsVisible(true);
    }, props.showDelay ?? 500);
  };

  const hideTooltip = () => {
    if (timeoutShow) clearTimeout(timeoutShow);
    timeoutHide = setTimeout(() => {
      setIsVisible(false);
    }, props.hideDelay ?? 200);
  };

  const [_handlers, local] = splitProps(props, [
    'onMouseOver',
    'onMouseOut',
    'onFocus',
    'onBlur',
  ]);

  const onMouseOver: ExtractFn<'onMouseOver'> = e => {
    showTooltip();
    return undefinedCall(_handlers.onMouseOver, e);
  };

  const onMouseOut: ExtractFn<'onMouseOut'> = e => {
    hideTooltip();
    return undefinedCall(_handlers.onMouseOut, e);
  };

  const onFocus: ExtractFn<'onFocus'> = e => {
    showTooltip();
    return undefinedCall(_handlers.onFocus, e);
  };

  const onBlur: ExtractFn<'onBlur'> = e => {
    hideTooltip();
    return undefinedCall(_handlers.onBlur, e);
  };

  const positionClass = createMemo(() =>
    getPositionClass(position, computedPosition()),
  );

  const handlers = {
    onMouseOver,
    onMouseOut,
    onFocus,
    onBlur,
  };

  return {
    isVisible,
    positionClass,
    setContainerRef,
    handlers,
    local,
  };
};
