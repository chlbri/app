import { createSignal, onCleanup } from 'solid-js';
import { VISIBLE_ESPACE } from '../constants';
import { espace } from '../helpers/espace';

type Props = {
  content: string;
  min: number;
  rewind?: boolean;
  rewindDelay?: number;
};

export const createTyping = ({ content, min, ...props }: Props) => {
  const rewind = props.rewind ?? false;
  const rewindDelay = (props as any).rewindDelay ?? 500;

  const OSCILLATION = Math.min(min / 10 + content.length / 10, 10);

  const [text, setText] = createSignal(VISIBLE_ESPACE);
  let timeoutId: number | NodeJS.Timeout;
  let index = 0;
  let isTyping = true;
  const max = min + OSCILLATION;
  let interval = min;
  let intervalDirection = 1; // 1 for incrementing, -1 for decrementing

  const type = () => {
    if (isTyping) {
      if (index < content.length) {
        setText(prev => prev + content[index]);
        index++;
        timeoutId = setTimeout(type, interval);
      } else if (rewind) {
        isTyping = false;
        // interval = min;
        intervalDirection = 1;
        timeoutId = setTimeout(type, rewindDelay);
      }
    } else {
      // Rewind mode
      if (index > 0) {
        index--;
        setText(espace(content.substring(0, index)));
        timeoutId = setTimeout(type, interval);
      } else {
        isTyping = true;
        // interval = min;
        intervalDirection = 1;
        timeoutId = setTimeout(type, rewindDelay);
      }
    }

    // Update interval with oscillation
    interval += intervalDirection;

    if (interval >= max) {
      intervalDirection = -1;
    } else if (interval <= min) {
      intervalDirection = 1;
    }
  };

  onCleanup(() => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  });

  return { text, type, setText };
};
