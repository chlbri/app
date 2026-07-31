import { cn } from '#cn';
import { createSignal, type Component, type JSX } from 'solid-js';

export type ExpandSlotProps = { isOpen: boolean };

export type ExpandProps = {
  title: Component<ExpandSlotProps> | JSX.Element;
  content?: Component<ExpandSlotProps> | JSX.Element;
  defaultOpen?: boolean;
  class?: string;
  id: string;
};

export const Expand: Component<ExpandProps> = props => {
  const [isOpen, setIsOpen] = createSignal(props.defaultOpen ?? false);

  const renderSlot = (slot: Component<ExpandSlotProps> | JSX.Element) => {
    if (typeof slot === 'function') {
      return (slot as Component<ExpandSlotProps>)({
        get isOpen() {
          return isOpen();
        },
      });
    }
    return slot;
  };

  return (
    <div
      class={cn(
        'rounded-xl border overflow-hidden transition-all',
        props.class,
      )}
    >
      <button
        onClick={() => setIsOpen(prev => !prev)}
        class='w-full'
        type='button'
        aria-expanded={isOpen()}
        aria-controls={props.id ? `${props.id}-content` : undefined}
      >
        {renderSlot(props.title)}
      </button>

      <div
        id={props.id ? `${props.id}-content` : undefined}
        class={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen() ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div class='overflow-hidden'>{renderSlot(props.content)}</div>
      </div>
    </div>
  );
};
