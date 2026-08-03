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
  className?: string;
  id: string;
};

export const Expand: React.FC<ExpandProps> = ({
  title,
  content,
  defaultOpen = false,
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const renderSlot = (slot: ExpandSlot) => {
    if (typeof slot === 'function') {
      const SlotComponent = slot as (
        props: ExpandSlotProps,
      ) => React.ReactNode;
      return SlotComponent({ isOpen });
    }
    return slot;
  };

  const toggle = () => setIsOpen(prev => !prev);

  return (
    <div
      className={cn(
        'rounded-xl border overflow-hidden transition-all',
        className,
      )}
    >
      <div
        onClick={toggle}
        className='w-full text-left cursor-pointer'
        role='button'
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        aria-expanded={isOpen}
        aria-controls={id ? `${id}-content` : undefined}
      >
        {renderSlot(title)}
      </div>

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
