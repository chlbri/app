import { createSignal, type Component } from 'solid-js';
import { Expand, type ExpandSlotProps } from './Expand';
import { cn } from '#cn';

type Props = {
  config: Record<string, any>;
  title: string;
  class?: string;
};

export const MachineConfig: Component<Props> = props => {
  const [copied, setCopied] = createSignal(false);
  const formattedCode = JSON.stringify(props.config, null, 2);

  const Title: Component<ExpandSlotProps> = titleProps => (
    <div class='flex w-full cursor-pointer items-center justify-between bg-slate-900 px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80'>
      <div class='flex items-center space-x-2.5'>
        <div class='rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-1.5 text-indigo-400'>
          <svg
            class='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
            />
          </svg>
        </div>
        <h2 class='font-semibold text-slate-200'>{props.title}</h2>
        <span class='rounded-md border border-indigo-500/30 bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-indigo-300 uppercase'>
          Config
        </span>
      </div>

      <div class='flex items-center space-x-2'>
        <span class='text-xs font-medium text-slate-400'>
          {titleProps.isOpen ? 'Hide Config' : 'Show Config'}
        </span>
        <svg
          class={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
            titleProps.isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='2'
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </div>
    </div>
  );

  const Content = (
    <div class='group relative border-t border-slate-800 bg-slate-950 p-4'>
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
        class='absolute top-3 right-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 font-sans text-xs text-slate-300 transition-all hover:bg-slate-700'
        type='button'
      >
        {copied() ? (
          <>
            <svg
              class='h-3.5 w-3.5 text-emerald-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M5 13l4 4L19 7'
              />
            </svg>
            <span class='font-medium text-emerald-400'>Copied!</span>
          </>
        ) : (
          <>
            <svg
              class='h-3.5 w-3.5 text-slate-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                stroke-width='2'
                d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z'
              />
            </svg>
            <span>Copy Code</span>
          </>
        )}
      </button>
      <pre class='max-h-96 overflow-x-auto p-2 font-mono text-xs leading-relaxed text-indigo-300 selection:bg-indigo-500/30'>
        {formattedCode}
      </pre>
    </div>
  );

  return (
    <Expand
      id='machine-config'
      title={Title}
      content={Content}
      class={cn(
        'mt-4 border-slate-800 border-3 bg-slate-900/60 shadow-lg',
        props.class,
      )}
    />
  );
};
