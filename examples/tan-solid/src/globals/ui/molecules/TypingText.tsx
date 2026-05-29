import {
  createEffect,
  createMemo,
  on,
  type Accessor,
  type Component,
} from 'solid-js';
import { createTyping } from '../signals/createTyping';
import { VISIBLE_ESPACE } from '../constants';

type BaseProps = {
  children: string;
  class?: string;
  interval?: number;
  disabled?: Accessor<boolean>;
};

type Props = BaseProps &
  (
    | {
        rewind: true;
        rewindDelay: number;
      }
    | { rewind?: false }
  );

export const TypingText: Component<Props> = props => {
  // #region Default values
  const min = props.interval ?? 62;
  const rewind = props.rewind ?? false;
  const rewindDelay = (props as any).rewindDelay ?? 500;
  const content = props.children;
  const disabled = createMemo(
    () => (props.disabled ? props.disabled() : false),
    false,
  );
  // #endregion

  const { text, type, setText } = createTyping({
    content,
    min,
    rewind,
    rewindDelay,
  });

  createEffect(on(disabled, () => setText(VISIBLE_ESPACE)));

  createEffect(() => {
    // If disabled, show full text immediately
    if (disabled()) setText(content);
    else type();
  });

  return <div class={props.class}>{text()}</div>;
};
