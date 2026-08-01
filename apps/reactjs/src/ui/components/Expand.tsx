import React, { useState } from 'react';
import { cn } from '../cn';

export type ExpandSlotProps = { isOpen: boolean };

export type ExpandSlot =
  | React.ComponentType<ExpandSlotProps>
  | ((props: ExpandSlotProps) => React.ReactNode)
  | React.ReactNode;

export type ExpandProps = {
  title: ExpandSlot;
  content?: ExpandSlot;
  defaultOpen?: boolean;
  class?: string;
  className?: string;
  id: string;
};

export const Expand: React.FC<ExpandProps> = ({
  title,
  content,
  defaultOpen = false,
  class: classProp,
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const renderSlot = (slot: ExpandSlot) => {
    if (typeof slot === 'function') {
      const SlotComponent = slot as (props: ExpandSlotProps) => React.ReactNode;
      return SlotComponent({ isOpen });
    }
    return slot;
  };

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden transition-all',
        classProp,
        className,
      )}
    >
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className='w-full text-left'
        type='button'
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-content` : undefined}
      >
        {renderSlot(title)}
      </button>

      <div
        id={id ? `${id}-content` : undefined}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className='overflow-hidden'>{renderSlot(content)}</div>
      </div>
    </div>
  );
};
