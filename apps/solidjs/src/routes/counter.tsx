import { interpret } from '@bemedev/app';
import { useService } from '@bemedev/app-solidjs';
import { createFileRoute } from '@tanstack/solid-router';
import { createEffect, onMount } from 'solid-js';
import { counterMachine } from '../machines/counter.machine';

const service = interpret(counterMachine, {
  context: { count: 0, step: 1 },
});

export const Route = createFileRoute('/counter')({
  component: () => {
    onMount(service.start);

    // Subscriptions with options
    const fullState = useService(service);
    const countOnly = useService(service, {
      selector: s => s.context.count,
    });
    const stateValue = useService(service, {
      selector: s => {
        return s.value;
      },
    });

    createEffect(() => {
      console.log('countOnly', countOnly());
    });

    const canStart = () => stateValue() === 'idle';

    return (
      <div class='max-w-4xl mx-auto space-y-8'>
        <div>
          <h2 class='text-3xl font-extrabold text-white'>
            Counter Machine Tester
          </h2>
          <p class='text-sm text-slate-400 mt-1'>
            Testing{' '}
            <code class='text-indigo-400 font-mono'>
              useService(service, &#123; selector, equality &#125;)
            </code>{' '}
            signals from `@bemedev/app-solidjs`
          </p>
        </div>

        {/* Counter Visual Display */}
        <div class='p-8 rounded-2xl bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center justify-center space-y-6'>
          <div class='text-center space-y-1'>
            <span class='text-xs uppercase font-bold tracking-widest text-slate-500'>
              Current Value
            </span>
            <div class='text-6xl font-black text-transparent bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text'>
              {countOnly()}
            </div>
          </div>

          <div class='flex items-center space-x-3'>
            <button
              onClick={() => service.send('DEC')}
              class='w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xl border border-slate-700 flex items-center justify-center transition-all cursor-pointer'
            >
              -
            </button>

            <button
              onClick={() => service.send('INC')}
              class='w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center transition-all cursor-pointer'
            >
              +
            </button>

            <button
              onClick={() => service.send('RESET')}
              class='px-4 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all cursor-pointer'
            >
              Reset
            </button>

            <button
              onClick={() => service.send(canStart() ? 'START' : 'STOP')}
              class='px-5 h-12 rounded-xl  text-white font-semibold text-sm shadow-lg transition-all cursor-pointer ease-in-out duration-300'
              classList={{
                'bg-red-600 hover:bg-red-500 shadow-red-600/30':
                  !canStart(),
                'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30':
                  canStart(),
              }}
            >
              {canStart() ? 'Start' : 'Stop'}
            </button>
          </div>
        </div>

        {/* Diagnostic Inspector */}
        <div class='p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 font-mono text-xs'>
          <h3 class='text-sm font-bold text-slate-200 font-sans'>
            State Inspector
          </h3>
          <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div class='p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2'>
              <span class='text-slate-500 font-bold'>
                State Value Accessor:
              </span>
              <pre class='text-indigo-300 font-bold'>
                {JSON.stringify(stateValue(), null, 2)}
              </pre>
            </div>
            <div class='p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2'>
              <span class='text-slate-500 font-bold'>
                Full Machine State Object:
              </span>
              <pre class='text-emerald-300 overflow-x-auto text-[11px] max-h-40'>
                {JSON.stringify(fullState(), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
