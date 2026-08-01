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
      <div class='max-w-5xl mx-auto space-y-8'>
        <div>
          <h2 class='text-3xl font-extrabold text-white'>
            Nested Traffic Machine Tester
          </h2>
          <p class='text-sm text-slate-400 mt-1'>
            {
              'Testing nested state values, tags, and reactive transitions via '
            }
            <code class='text-purple-400 font-mono'>useService</code>
          </p>
        </div>
        <MachineConfig
          config={trafficMachine.config}
          title='Traffic Machine Configuration'
        />

        <div class='flex flex-col gap-7 lg:flex-row w-full justify-center'>
          {/* Traffic Light Visualizer */}
          <div class='p-8 rounded-2xl bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-around gap-8 min-w-md'>
            {/* Traffic Light Tower */}
            <div class='w-24 p-4 rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-inner flex flex-col gap-4 items-center'>
              {/* Red Light */}
              <div
                class={cn(
                  'w-14 h-14 rounded-full border-2 transition-all duration-300',
                  `${
                    isRed()
                      ? 'bg-red-500 border-red-300 shadow-[0_0_25px_rgba(239,68,68,0.8)] scale-105'
                      : 'bg-red-950/40 border-red-900/40 opacity-40'
                  }`,
                )}
              />
              {/* Yellow Light */}
              <div
                class={cn(
                  'w-14 h-14 rounded-full border-2 transition-all duration-300',
                  `${
                    isYellow()
                      ? 'bg-amber-400 border-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.8)] scale-105'
                      : 'bg-amber-950/40 border-amber-900/40 opacity-40'
                  }`,
                )}
              />
              {/* Green Light */}
              <div
                class={cn(
                  'w-14 h-14 rounded-full border-2 transition-all duration-300',
                  `${
                    isGreen()
                      ? 'bg-emerald-500 border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.8)] scale-105'
                      : 'bg-emerald-950/40 border-emerald-900/40 opacity-40'
                  }`,
                )}
              />
            </div>

            {/* Machine Controls & Active Tags */}
            <div class='space-y-6 flex-1 max-w-md'>
              <div class='space-y-2'>
                <span class='text-xs uppercase font-bold tracking-widest text-slate-500'>
                  Active Tags
                </span>
                <div class='flex flex-wrap gap-2'>
                  <For each={tags()} fallback={<p>No tags</p>}>
                    {tag => (
                      <span class='px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'>
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
                class='w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer'
              >
                {isAccelerated() ? '↘️ DECELERATE' : '↗️ ACCELERATE'}
              </button>

              <div class='space-y-3'>
                <button
                  onClick={() => service.send('NEXT')}
                  class='w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer'
                >
                  Send NEXT Event
                </button>
              </div>
            </div>
          </div>

          {/* State Inspector */}
          <div class='p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex gap-5 font-mono text-xs w-max mx-auto lg:mx-0'>
            <div>
              <h3 class='text-sm font-bold text-slate-200 font-sans mb-2 pl-2'>
                Current value
              </h3>
              <pre class='text-purple-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto w-52'>
                {JSON.stringify(fullState().value, null, 2)}
              </pre>
            </div>
            <div>
              <h3 class='text-sm font-bold text-slate-200 font-sans mb-2 pl-2'>
                Full State Representation
              </h3>
              <pre class='text-purple-300 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto w-60'>
                {JSON.stringify(fullState(), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
