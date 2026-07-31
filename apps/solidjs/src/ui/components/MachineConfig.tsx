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
    <div class='w-full px-4 py-3 bg-slate-900 hover:bg-slate-800/80 text-slate-300 font-medium text-sm flex items-center justify-between transition-colors cursor-pointer'>
      <div class='flex items-center space-x-2.5'>
        <div class='p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'>
          <svg
            class='w-4 h-4'
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
        <span class='px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md'>
          Config
        </span>
      </div>

      <div class='flex items-center space-x-2'>
        <span class='text-xs text-slate-400 font-medium'>
          {titleProps.isOpen ? 'Hide Config' : 'Show Config'}
        </span>
        <svg
          class={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
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
    <div class='p-4 border-t border-slate-800 bg-slate-950 relative group'>
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
        class='absolute top-3 right-3 px-2.5 py-1 text-xs font-sans rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer z-10'
        type='button'
      >
        {copied() ? (
          <>
            <svg
              class='w-3.5 h-3.5 text-emerald-400'
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
            <span class='text-emerald-400 font-medium'>Copied!</span>
          </>
        ) : (
          <>
            <svg
              class='w-3.5 h-3.5 text-slate-400'
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
      <pre class='font-mono text-xs text-indigo-300 overflow-x-auto max-h-96 p-2 leading-relaxed selection:bg-indigo-500/30'>
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
