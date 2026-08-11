import { cn } from '#cn';
import { useService } from '@bemedev/app-solidjs';
import { createFileRoute } from '@tanstack/solid-router';
import { For } from 'solid-js';
import { trafficMachine } from '../machines/traffic.machine';
import { MachineConfig } from '../ui/components/MachineConfig';

export const Route = createFileRoute('/traffic')({
  component: () => {
    const service = Route.useRouteContext({
      select: s => s.trafficService,
    })();

    const hooks = useService(service);
    const fullState = hooks.state();
    const tags = () => fullState().tags;
    const isRed = hooks.isInside('flow.red');
    const isYellow = hooks.isInside('flow.yellow');
    const isGreen = hooks.isInside('flow.green');
    const isAccelerated = hooks.can('SLOW_DOWN');

    return (
      <div class='mx-auto max-w-5xl space-y-8'>
        <div>
          <h2 class='text-3xl font-extrabold text-white'>
            Nested Traffic Machine Tester
          </h2>
          <p class='mt-1 text-sm text-slate-400'>
            {
              'Testing nested state values, tags, and reactive transitions via '
            }
            <code class='font-mono text-purple-400'>useService</code>
          </p>
        </div>
        <MachineConfig
          config={trafficMachine.config}
          title='Traffic Machine Configuration'
        />

        <div class='flex w-full flex-col justify-center gap-7 lg:flex-row'>
          {/* Traffic Light Visualizer */}
          <div class='flex min-w-md flex-col items-center justify-around gap-8 rounded-2xl border border-slate-800 bg-linear-to-b from-slate-900 to-slate-950 p-8 shadow-2xl md:flex-row'>
            {/* Traffic Light Tower */}
            <div class='flex w-24 flex-col items-center gap-4 rounded-3xl border-4 border-slate-800 bg-slate-950 p-4 shadow-inner'>
              {/* Red Light */}
              <div
                class={cn(
                  'w-14 h-14 rounded-full border-2 transition-all duration-300',
                  `${
                    isRed()
                      ? 'scale-105 border-red-300 bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.8)]'
                      : 'border-red-900/40 bg-red-950/40 opacity-40'
                  }`,
                )}
              />
              {/* Yellow Light */}
              <div
                class={cn(
                  'w-14 h-14 rounded-full border-2 transition-all duration-300',
                  `${
                    isYellow()
                      ? 'scale-105 border-amber-200 bg-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)]'
                      : 'border-amber-900/40 bg-amber-950/40 opacity-40'
                  }`,
                )}
              />
              {/* Green Light */}
              <div
                class={cn(
                  'w-14 h-14 rounded-full border-2 transition-all duration-300',
                  `${
                    isGreen()
                      ? 'scale-105 border-emerald-300 bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.8)]'
                      : 'border-emerald-900/40 bg-emerald-950/40 opacity-40'
                  }`,
                )}
              />
            </div>

            {/* Machine Controls & Active Tags */}
            <div class='max-w-md flex-1 space-y-6'>
              <div class='space-y-2'>
                <span class='text-xs font-bold tracking-widest text-slate-500 uppercase'>
                  Active Tags
                </span>
                <div class='flex flex-wrap gap-2'>
                  <For each={tags()} fallback={<p>No tags</p>}>
                    {tag => (
                      <span class='rounded-full border border-purple-500/40 bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 shadow-sm'>
                        #{tag}
                      </span>
                    )}
                  </For>
                </div>
              </div>

              <button
                onClick={() =>
                  service.send(
                    isAccelerated() ? 'SLOW_DOWN' : 'ACCELERATE',
                  )
                }
                class='w-full cursor-pointer rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500'
              >
                {isAccelerated() ? '↘️ DECELERATE' : '↗️ ACCELERATE'}
              </button>

              <div class='space-y-3'>
                <button
                  onClick={() => service.send('NEXT')}
                  class='w-full cursor-pointer rounded-xl bg-purple-600 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-500'
                >
                  Send NEXT Event
                </button>
              </div>
            </div>
          </div>

          {/* State Inspector */}
          <div class='mx-auto flex w-max gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 font-mono text-xs lg:mx-0'>
            <div>
              <h3 class='mb-2 pl-2 font-sans text-sm font-bold text-slate-200'>
                Current value
              </h3>
              <pre class='w-52 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-purple-300'>
                {JSON.stringify(fullState().value, null, 2)}
              </pre>
            </div>
            <div>
              <h3 class='mb-2 pl-2 font-sans text-sm font-bold text-slate-200'>
                Full State Representation
              </h3>
              <pre class='w-60 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-purple-300'>
                {JSON.stringify(fullState(), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
