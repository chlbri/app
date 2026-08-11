import React, { useState } from 'react';
import { Expand, type ExpandSlotProps } from './Expand';
import { cn } from '../cn';

export type MachineConfigProps = {
  config: any;
  title: string;
  className?: string;
};

export const MachineConfig: React.FC<MachineConfigProps> = ({
  config,
  title,
  className,
}) => {
  const [copied, setCopied] = useState(false);
  const formattedCode =
    typeof config === 'string' ? config : JSON.stringify(config, null, 2);

  const Title = (titleProps: ExpandSlotProps) => (
    <div className='flex w-full cursor-pointer items-center justify-between bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80'>
      <div className='flex items-center space-x-2.5'>
        <div className='rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-1.5 text-indigo-400'>
          <svg
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
            />
          </svg>
        </div>
        <h2 className='font-semibold text-slate-200'>{title}</h2>
        <span className='rounded-md border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-indigo-300 uppercase'>
          Config
        </span>
      </div>

      <div className='flex items-center space-x-2'>
        <span className='text-xs font-medium text-slate-400'>
          {titleProps.isOpen ? 'Hide Config' : 'Show Config'}
        </span>
        <svg
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
            titleProps.isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </div>
    </div>
  );

  const Content = (
    <div className='group relative border-t border-slate-800 bg-slate-950 p-4'>
      <button
        onClick={async e => {
          e.stopPropagation();
          try {
            await navigator.clipboard.writeText(formattedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error('Failed to copy machine config:', err);
          }
        }}
        className='absolute top-3 right-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 font-sans text-xs text-slate-300 transition-all hover:bg-slate-700'
        type='button'
      >
        {copied ? (
          <>
            <svg
              className='h-3.5 w-3.5 text-emerald-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 13l4 4L19 7'
              />
            </svg>
            <span className='font-medium text-emerald-400'>Copied!</span>
          </>
        ) : (
          <>
            <svg
              className='h-3.5 w-3.5 text-slate-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2 2v8a2 2 0 012 2z'
              />
            </svg>
            <span>Copy Code</span>
          </>
        )}
      </button>
      <pre className='max-h-96 overflow-x-auto p-2 font-mono text-xs leading-relaxed text-indigo-300 selection:bg-indigo-500/30'>
        {formattedCode}
      </pre>
    </div>
  );

  return (
    <Expand
      id='machine-config'
      title={Title}
      content={Content}
      className={cn(
        'mt-4 border-slate-800 border-3 bg-slate-900/60 shadow-lg',
        className,
      )}
    />
  );
};
