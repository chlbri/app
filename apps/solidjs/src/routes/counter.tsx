import { createService } from '@bemedev/app-solidjs';
import { createFileRoute } from '@tanstack/solid-router';
import { counterMachine } from '../machines/counter.machine';
import { MachineConfig } from '../ui/components/MachineConfig';

export const Route = createFileRoute('/counter')({
  component: () => {
    const service = Route.useRouteContext({
      select: s => s.counterService,
    })();

    // Subscriptions with options
    const hooks = createService(service);
    const fullState = hooks.state();
    const countOnly = () => fullState().context.count;
    const stateValue = () => fullState().value;
    const canStart = hooks.can('START');

    return (
      <div class='mx-auto max-w-5xl space-y-8'>
        <div>
          <h2 class='text-3xl font-extrabold text-white'>
            Counter Machine Tester
          </h2>
          <p class='mt-1 text-sm text-slate-400'>
            {'Testing '}
            <code class='font-mono text-indigo-400'>
              useService(service, &#123; selector, equality &#125;)
            </code>
            {' signals from `@bemedev/app-solidjs`'}
          </p>
        </div>

        <MachineConfig
          config={counterMachine.config}
          title='Counter Machine Configuration'
          class='rounded-md'
        />

        {/* Counter Visual Display */}
        <div class='mx-auto flex w-sm flex-col items-center justify-center space-y-6 rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 p-8 shadow-2xl'>
          <div class='space-y-1 text-center'>
            <span class='text-xs font-bold tracking-widest text-slate-500 uppercase'>
              Current Value
            </span>
            <div class='bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-6xl font-black text-transparent'>
              {countOnly()}
            </div>
          </div>

          <div class='flex items-center space-x-3'>
            <button
              onClick={() => service.send('DEC')}
              class='flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-xl font-bold text-white transition-all hover:bg-slate-700 disabled:opacity-40'
              disabled={canStart()}
            >
              -
            </button>

            <button
              onClick={() => service.send('INC')}
              class='flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-40'
              disabled={canStart()}
            >
              +
            </button>

            <button
              onClick={() => service.send('RESET')}
              class='h-12 cursor-pointer rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700'
            >
              Reset
            </button>

            <button
              onClick={() => service.send(canStart() ? 'START' : 'STOP')}
              class='h-12 cursor-pointer rounded-xl px-5 text-sm font-semibold text-white shadow-lg transition-all duration-300 ease-in-out'
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
        <div class='space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 font-mono text-xs'>
          <h3 class='font-sans text-sm font-bold text-slate-200'>
            State Inspector
          </h3>
          <div class='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div class='flex flex-col space-y-1 rounded-xl border border-slate-800 bg-slate-950 p-4'>
              <span class='font-bold text-slate-500'>
                State Value Accessor:
              </span>
              <pre class='font-bold text-indigo-300'>
                {JSON.stringify(stateValue(), null, 2)}
              </pre>
            </div>
            <div class='flex flex-col space-y-1 rounded-xl border border-slate-800 bg-slate-950 p-4'>
              <span class='font-bold text-slate-500'>
                Full Machine State Object:
              </span>
              <pre class='max-h-40 overflow-x-auto text-[11px] text-emerald-300'>
                {JSON.stringify(fullState(), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
